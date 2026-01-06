"use server";

import { fetchNicknamesByUserIds, sendCrewMessage } from "@/lib/supabase/chat";

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

export async function sendCrewMessageAction(params: {
  crewId: string;
  content: string;
}) {
  debugLog({
    runId: "rt-debug1",
    hypothesisId: "RT",
    location: "chat-actions.ts:sendCrewMessageAction",
    message: "enter",
    data: { crewIdLen: params.crewId.length, contentLen: params.content.length },
  });
  const row = await sendCrewMessage(params);
  debugLog({
    runId: "rt-debug1",
    hypothesisId: "RT",
    location: "chat-actions.ts:sendCrewMessageAction",
    message: "exit_ok",
  });
  return row;
}

export async function fetchNicknamesAction(userIds: string[]) {
  return await fetchNicknamesByUserIds(userIds);
}


