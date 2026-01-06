import { createClient } from "./server";

export interface CrewChatMessage {
  id: string;
  crew_id: string;
  user_id: string;
  content: string;
  created_at: string;
  nickname: string;
}

export type CrewChatMessageRow = Omit<CrewChatMessage, "nickname">;

export async function fetchNicknamesByUserIds(userIds: string[]) {
  const supabase = await createClient();
  const uniqueIds = Array.from(new Set(userIds)).filter(Boolean);
  if (uniqueIds.length === 0) return {} as Record<string, string>;

  const { data, error } = await supabase
    .from("itta_profiles")
    .select("user_id,nickname")
    .in("user_id", uniqueIds);

  if (error) throw new Error(error.message);

  const map: Record<string, string> = {};
  (data ?? []).forEach((row) => {
    map[row.user_id as string] = row.nickname as string;
  });
  return map;
}

export async function fetchCrewMessages(crewId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("itta_crew_messages")
    .select("id,crew_id,user_id,content,created_at")
    .eq("crew_id", crewId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Array<{
    id: string;
    crew_id: string;
    user_id: string;
    content: string;
    created_at: string;
  }>;

  const nicknameByUserId = await fetchNicknamesByUserIds(
    rows.map((row) => row.user_id)
  );

  return rows.map((row) => ({
    ...row,
    nickname: nicknameByUserId[row.user_id] ?? "알수없음",
  })) as CrewChatMessage[];
}

export async function sendCrewMessage(params: { crewId: string; content: string }) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("로그인이 필요합니다.");

  const trimmed = params.content.trim();
  if (!trimmed) return;

  const { data, error } = await supabase
    .from("itta_crew_messages")
    .insert({
      crew_id: params.crewId,
      user_id: user.id,
      content: trimmed,
    })
    .select("id,crew_id,user_id,content,created_at")
    .single();

  if (error) throw new Error(error.message);
  return data as CrewChatMessageRow;
}


