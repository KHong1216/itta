import { createClient } from "./server";

export interface IttaCrewRow {
  id: string;
  title: string;
  image_url: string;
  category: string;
  location_text: string;
  scheduled_at_text: string;
  max_members: number;
  members_count: number;
  created_by: string;
  created_at: string;
}

export interface CreateCrewInput {
  title: string;
  imageUrl: string;
  category: string;
  locationText: string;
  scheduledAtText: string;
  maxMembers: number;
}

export async function fetchCrews() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("itta_crews")
    .select(
      "id,title,image_url,category,location_text,scheduled_at_text,max_members,members_count,created_by,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as IttaCrewRow[];
}

export async function createCrew(input: CreateCrewInput) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("itta_create_crew", {
    p_title: input.title,
    p_image_url: input.imageUrl,
    p_category: input.category,
    p_location_text: input.locationText,
    p_scheduled_at_text: input.scheduledAtText,
    p_max_members: input.maxMembers,
  });

  if (error) throw new Error(error.message);
  return data as IttaCrewRow;
}


