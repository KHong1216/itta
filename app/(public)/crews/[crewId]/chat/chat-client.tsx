"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { CrewChatMessage, CrewChatMessageRow } from "@/lib/supabase/chat";
import { fetchNicknamesAction, sendCrewMessageAction } from "@/lib/chat-actions";

function debugLog(payload: {
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  // #region agent log
  fetch("http://127.0.0.1:7247/ingest/b30fb1d9-0075-4c65-88fd-363bf56691f1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      timestamp: Date.now(),
      ...payload,
      data: payload.data ?? {},
    }),
  }).catch(() => {});
  // #endregion agent log
}

interface ChatClientProps {
  crewId: string;
  initialMessages: CrewChatMessage[];
  currentUserId: string | null;
}

export function ChatClient({
  crewId,
  initialMessages,
  currentUserId,
}: ChatClientProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const channelRef = useRef<any>(null);
  const scrollBoxRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const [messages, setMessages] = useState<CrewChatMessage[]>(initialMessages);
  const [nicknameByUserId, setNicknameByUserId] = useState<Record<string, string>>(
    () =>
      initialMessages.reduce<Record<string, string>>((acc, message) => {
        acc[message.user_id] = message.nickname;
        return acc;
      }, {})
  );
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<string>("connecting");
  const [lastRealtimeAt, setLastRealtimeAt] = useState<string | null>(null);

  const nicknameByUserIdRef = useRef(nicknameByUserId);
  nicknameByUserIdRef.current = nicknameByUserId;

  const pendingByContentRef = useRef<Record<string, string[]>>({});

  function addPending(content: string, tempId: string) {
    const prev = pendingByContentRef.current[content] ?? [];
    pendingByContentRef.current = {
      ...pendingByContentRef.current,
      [content]: [...prev, tempId],
    };
  }

  function popPending(content: string) {
    const prev = pendingByContentRef.current[content] ?? [];
    if (prev.length === 0) return null;
    const [first, ...rest] = prev;
    pendingByContentRef.current = { ...pendingByContentRef.current, [content]: rest };
    return first;
  }

  useEffect(() => {
    debugLog({
      runId: "rt-debug1",
      hypothesisId: "RT",
      location: "chat-client.tsx:useEffect",
      message: "mount",
      data: { hasUser: !!currentUserId, crewIdLen: crewId.length, crewIdHead: crewId.slice(0, 8) },
    });

    // TEMP DEBUG: verify realtime connection + auth
    void (async () => {
      try {
        const session = await supabase.auth.getSession();
        console.log("[chat] auth session?", {
          hasSession: !!session.data.session,
          hasUser: !!session.data.session?.user,
        });
        debugLog({
          runId: "rt-debug2",
          hypothesisId: "RT",
          location: "chat-client.tsx:getSession",
          message: "auth_session",
          data: {
            hasSession: !!session.data.session,
            hasUser: !!session.data.session?.user,
          },
        });

        // Probe RLS: can this client SELECT membership + messages?
        if (currentUserId) {
          const membershipRes = await supabase
            .from("itta_crew_memberships")
            // membership table schema differs by project; avoid assuming an `id` column
            .select("user_id")
            .eq("crew_id", crewId)
            .eq("user_id", currentUserId)
            .limit(1);

          debugLog({
            runId: "rt-debug2",
            hypothesisId: "RT",
            location: "chat-client.tsx:probe",
            message: "membership_select",
            data: {
              hasError: !!membershipRes.error,
              hasRow: (membershipRes.data ?? []).length > 0,
              // safe to log: schema/config errors only (no secrets)
              errCode: membershipRes.error?.code ?? "none",
              errMsg: membershipRes.error?.message
                ? String(membershipRes.error.message).slice(0, 120)
                : "none",
            },
          });

          const msgRes = await supabase
            .from("itta_crew_messages")
            .select("id")
            .eq("crew_id", crewId)
            .limit(1);

          debugLog({
            runId: "rt-debug2",
            hypothesisId: "RT",
            location: "chat-client.tsx:probe",
            message: "messages_select",
            data: {
              hasError: !!msgRes.error,
              hasRow: (msgRes.data ?? []).length > 0,
              errCode: msgRes.error?.code ?? "none",
              errMsg: msgRes.error?.message
                ? String(msgRes.error.message).slice(0, 120)
                : "none",
            },
          });
        }
      } catch (e) {
        console.log("[chat] auth getSession error", e);
        debugLog({
          runId: "rt-debug2",
          hypothesisId: "RT",
          location: "chat-client.tsx:getSession",
          message: "auth_session_error",
        });
      }
    })();

    const channel = supabase
      .channel(`itta_crew_messages:${crewId}`)
      .on(
        "broadcast",
        { event: "itta_ping" },
        (payload) => {
          console.log("[chat] broadcast itta_ping", payload);
          debugLog({
            runId: "rt-debug1",
            hypothesisId: "RT",
            location: "chat-client.tsx:broadcast",
            message: "rx_ping",
            data: { from: typeof (payload as any)?.payload?.from === "string" ? "set" : "missing" },
          });
        }
      )
      .on(
        "broadcast",
        { event: "itta_message" },
        (payload) => {
          const row = (payload as any)?.payload?.row as CrewChatMessageRow | undefined;
          if (!row?.id || !row?.crew_id || !row?.user_id) return;
          if (row.crew_id !== crewId) return;

          debugLog({
            runId: "rt-debug3",
            hypothesisId: "RT",
            location: "chat-client.tsx:broadcast",
            message: "rx_message",
            data: { fromMe: !!currentUserId && row.user_id === currentUserId },
          });

          setLastRealtimeAt(new Date().toISOString());

          if (currentUserId && row.user_id === currentUserId) return;

          const nickname = nicknameByUserIdRef.current[row.user_id] ?? "…";
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, { ...row, nickname }];
          });

          if (nicknameByUserIdRef.current[row.user_id]) return;
          void (async () => {
            try {
              const result = await fetchNicknamesAction([row.user_id]);
              const resolvedNickname = result[row.user_id];
              if (!resolvedNickname) return;

              setNicknameByUserId((prev) => ({ ...prev, [row.user_id]: resolvedNickname }));
              setMessages((prev) =>
                prev.map((m) =>
                  m.user_id === row.user_id && m.nickname === "…" ? { ...m, nickname: resolvedNickname } : m
                )
              );
            } catch {
              // ignore
            }
          })();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "itta_crew_messages",
          filter: `crew_id=eq.${crewId}`,
        },
        (payload) => {
          console.log("[chat] realtime INSERT", {
            hasNew: !!payload.new,
            created_at: (payload.new as any)?.created_at,
            user_id: (payload.new as any)?.user_id,
          });
          setLastRealtimeAt(new Date().toISOString());
          debugLog({
            runId: "rt-debug1",
            hypothesisId: "RT",
            location: "chat-client.tsx:realtime",
            message: "insert_event",
            data: {
              hasNew: !!payload.new,
              userId: (payload.new as any)?.user_id ? "set" : "missing",
              contentLen: String((payload.new as any)?.content ?? "").length,
            },
          });

          const row = payload.new as Omit<CrewChatMessage, "nickname">;
          const nickname = nicknameByUserIdRef.current[row.user_id] ?? "…";

          if (currentUserId && row.user_id === currentUserId) {
            const tempId = popPending(row.content);
            if (tempId) setMessages((prev) => prev.filter((m) => m.id !== tempId));
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, { ...row, nickname }];
          });

          if (nicknameByUserIdRef.current[row.user_id]) return;
          void (async () => {
            try {
              const result = await fetchNicknamesAction([row.user_id]);
              const resolvedNickname = result[row.user_id];
              if (!resolvedNickname) return;

              setNicknameByUserId((prev) => ({ ...prev, [row.user_id]: resolvedNickname }));
              setMessages((prev) =>
                prev.map((m) =>
                  m.user_id === row.user_id && m.nickname === "…" ? { ...m, nickname: resolvedNickname } : m
                )
              );
            } catch {
              // ignore
            }
          })();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "itta_crew_messages" },
        (payload) => {
          console.log("[chat] realtime INSERT (no filter)", {
            hasNew: !!payload.new,
            crew_id: (payload.new as any)?.crew_id,
          });
          debugLog({
            runId: "rt-debug1",
            hypothesisId: "RT",
            location: "chat-client.tsx:realtime",
            message: "insert_event_no_filter",
            data: {
              hasNew: !!payload.new,
              crewIdMatches: (payload.new as any)?.crew_id === crewId,
            },
          });
        }
      )
      .subscribe((status, err) => {
        console.log("[chat] realtime status", { status, err });
        setRealtimeStatus(status);
        debugLog({
          runId: "rt-debug1",
          hypothesisId: "RT",
          location: "chat-client.tsx:subscribe",
          message: "status",
          data: { status, hasErr: !!err },
        });

        if (status !== "SUBSCRIBED") return;
        debugLog({
          runId: "rt-debug1",
          hypothesisId: "RT",
          location: "chat-client.tsx:broadcast",
          message: "tx_ping_attempt",
        });
        void channel.send({
          type: "broadcast",
          event: "itta_ping",
          payload: { from: currentUserId ? "user" : "anon" },
        });
      });

    channelRef.current = channel;
    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [supabase, crewId, currentUserId]);

  // Initial load: always jump to the latest message.
  useLayoutEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom) return;

    shouldAutoScrollRef.current = true;
    bottom.scrollIntoView({ behavior: "auto", block: "end" });
    // one more frame for safer layout (fonts, etc.)
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    });
  }, [crewId]);

  // Auto-scroll: keep the view pinned to bottom only when user is already near bottom.
  useEffect(() => {
    const el = scrollBoxRef.current;
    if (!el) return;

    const thresholdPx = 120;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      shouldAutoScrollRef.current = distanceFromBottom < thresholdPx;
    };

    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = bottomRef.current;
    if (!target) return;
    if (!shouldAutoScrollRef.current) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  async function handleSend() {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    debugLog({
      runId: "rt-debug1",
      hypothesisId: "RT",
      location: "chat-client.tsx:handleSend",
      message: "send_click",
      data: { contentLen: trimmed.length },
    });

    const tempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const now = new Date().toISOString();
    const myNickname = nicknameByUserIdRef.current[currentUserId] ?? "나";

    addPending(trimmed, tempId);
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        crew_id: crewId,
        user_id: currentUserId,
        content: trimmed,
        created_at: now,
        nickname: myNickname,
      },
    ]);
    setContent("");

    setIsSending(true);
    try {
      const inserted = await sendCrewMessageAction({ crewId, content: trimmed });
      debugLog({
        runId: "rt-debug1",
        hypothesisId: "RT",
        location: "chat-client.tsx:handleSend",
        message: "send_action_ok",
      });

      if (inserted?.id) {
        // replace temp id with real row id for stable de-dupe
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  id: inserted.id,
                  created_at: inserted.created_at ?? m.created_at,
                }
              : m
          )
        );

        // Broadcast for instant cross-user delivery (works even when Postgres Changes is broken)
        const channel = channelRef.current;
        if (!channel) return;
        void channel.send({
          type: "broadcast",
          event: "itta_message",
          payload: { row: inserted },
        });
      }
    } catch (error) {
      popPending(trimmed);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      debugLog({
        runId: "rt-debug1",
        hypothesisId: "RT",
        location: "chat-client.tsx:handleSend",
        message: "send_action_error",
      });
      alert(error instanceof Error ? error.message : "전송에 실패했어요.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
      <div className="px-6 py-3 text-xs font-bold text-slate-400 border-b border-slate-50 flex items-center justify-between">
        <span>Realtime: {realtimeStatus}</span>
        <span>{lastRealtimeAt ? `last: ${lastRealtimeAt.slice(11, 19)}` : ""}</span>
      </div>
      <div
        ref={scrollBoxRef}
        className="h-[60vh] overflow-y-auto p-6 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="text-sm text-slate-400 font-semibold">
            첫 메시지를 남겨보세요.
          </div>
        ) : (
          messages.map((message) => {
            const isMine = !!currentUserId && message.user_id === currentUserId;
            return (
              <div
                key={message.id}
                className={isMine ? "flex justify-end" : "flex justify-start"}
              >
                <div className="max-w-[80%]">
                  {!isMine ? (
                    <div className="text-xs font-black text-slate-400 ml-2 mb-1">
                      {message.nickname}
                    </div>
                  ) : null}
                  <div
                    className={
                      isMine
                        ? "bg-indigo-600 text-white rounded-2xl px-4 py-3 text-sm font-medium"
                        : "bg-slate-100 text-slate-900 rounded-2xl px-4 py-3 text-sm font-medium"
                    }
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 p-4 flex gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            void handleSend();
          }}
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={isSending}
          className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}


