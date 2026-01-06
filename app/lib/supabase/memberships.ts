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

export async function fetchMyCrews() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) return [] as MyCrewMembership[];

  const { data, error } = await supabase
    .from("itta_crew_memberships")
    .select(
      "crew_id,role,joined_at,crew:itta_crews(id,title,image_url,category,location_text,scheduled_at_text,max_members,members_count,created_by,created_at)"
    )
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    crewId: row.crew_id as string,
    role: row.role as string,
    joinedAt: row.joined_at as string,
    crew: row.crew as IttaCrewRow,
  })) as MyCrewMembership[];
}


