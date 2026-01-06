import { ExploreHeader } from "../../features/explore/explore-header";
import { ExploreContent } from "../../features/explore/explore-content";
import { categories } from "@/lib/data/categories";
import type { Crew } from "@/lib/data/crews";
import { fetchCrews } from "@/lib/supabase/crews";
import { IttaCrewRow } from "@/lib/supabase/crews";

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

export default async function ExplorePage() {
  const rows = await fetchCrews();
  const crews = rows.map(toCrew);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <ExploreHeader />
      <ExploreContent initialCrews={crews} categories={categories} />
    </div>
  );
}
