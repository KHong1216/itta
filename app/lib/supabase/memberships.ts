import { createClient } from "./server";
import type { IttaCrewRow } from "./crews";

export interface IttaCrewMembershipRow {
  crew_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface MyCrewMembership {
  crewId: string;
  role: string;
  joinedAt: string;
  crew: IttaCrewRow;
}

export interface JoinCrewResult {
  alreadyJoined: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isIttaCrewRow(value: unknown): value is IttaCrewRow {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.image_url === "string" &&
    typeof value.category === "string" &&
    typeof value.location_text === "string" &&
    typeof value.scheduled_at_text === "string" &&
    typeof value.max_members === "number" &&
    typeof value.members_count === "number" &&
    typeof value.created_by === "string" &&
    typeof value.created_at === "string"
  );
}

function pickCrew(value: unknown): IttaCrewRow | null {
  if (Array.isArray(value)) {
    const first = value[0];
    return isIttaCrewRow(first) ? first : null;
  }
  if (isIttaCrewRow(value)) return value;
  return null;
}

export async function joinCrew(crewId: string): Promise<JoinCrewResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase
    .from("itta_crew_memberships")
    .insert({ crew_id: crewId, user_id: user.id, role: "member" });

  if (error) {
    if (error.code === "23505") return { alreadyJoined: true };
    throw new Error(error.message);
  }

  return { alreadyJoined: false };
}

interface FetchMyCrewsRow {
  crew_id: string | null;
  role: string | null;
  joined_at: string | null;
  crew: unknown;
}

export async function fetchMyCrews(): Promise<MyCrewMembership[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) return [];

  const { data, error } = await supabase
    .from("itta_crew_memberships")
    .select(
      "crew_id,role,joined_at,crew:itta_crews(id,title,image_url,category,location_text,scheduled_at_text,max_members,members_count,created_by,created_at)"
    )
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as FetchMyCrewsRow[];

  return rows.flatMap((row) => {
    const crew = pickCrew(row.crew);
    if (!crew) return [];
    if (!row.crew_id || !row.role || !row.joined_at) return [];

    return [
      {
        crewId: row.crew_id,
        role: row.role,
        joinedAt: row.joined_at,
        crew,
      },
    ];
  });
}


