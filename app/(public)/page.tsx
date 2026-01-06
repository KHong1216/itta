import type { Crew } from "@/lib/data/crews";
import { fetchCrews } from "@/lib/supabase/crews";
import type { IttaCrewRow } from "@/lib/supabase/crews";
import { HomeClient } from "./home-client";

function toCrew(row: IttaCrewRow): Crew {
  return {
    id: row.id,
    image: row.image_url,
    category: row.category,
    title: row.title,
    location: row.location_text,
    date: row.scheduled_at_text,
    members: row.members_count,
    maxMembers: row.max_members,
  };
}

export default async function HomePage() {
  const rows = await fetchCrews();
  const crews = rows.slice(0, 6).map(toCrew);
  return <HomeClient crews={crews} />;
}

