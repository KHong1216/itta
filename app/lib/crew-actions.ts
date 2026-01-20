"use server";

import { revalidatePath } from "next/cache";
import { createCrew } from "./supabase/crews";
import { joinCrew } from "./supabase/memberships";
import { createClient } from "./supabase/server";

const ITTA_CREW_IMAGE_BUCKET = "itta_crew_images";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getInt(formData: FormData, key: string, fallback: number) {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function getFileExt(fileName: string) {
  const parts = fileName.split(".");
  return parts.length >= 2 ? (parts.at(-1) ?? "jpg") : "jpg";
}

async function uploadCrewImage(params: { userId: string; file: File }) {
  const supabase = await createClient();

  const ext = getFileExt(params.file.name);
  const path = `crews/${params.userId}/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await params.file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(ITTA_CREW_IMAGE_BUCKET)
    .upload(path, bytes, { contentType: params.file.type, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(ITTA_CREW_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function convertKSTToUTC(dateTimeLocal: string): string {
  if (!dateTimeLocal) return "";
  
  const localDate = new Date(dateTimeLocal);
  
  const kstOffset = 9 * 60;
  const utc = localDate.getTime() - kstOffset * 60000;
  const utcDate = new Date(utc);
  
  return utcDate.toISOString();
}

function formatKSTDateTime(dateTimeLocal: string): string {
  if (!dateTimeLocal) return "";
  
  const localDate = new Date(dateTimeLocal);
  const kstOffset = 9 * 60;
  const kstTime = localDate.getTime() + kstOffset * 60000;
  const kstDate = new Date(kstTime);
  
  return kstDate.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });
}

export async function createCrewAction(formData: FormData) {
  const title = getString(formData, "title");
  const category = getString(formData, "category");
  const location = getString(formData, "location");
  const dateTimeLocal = getString(formData, "date");
  const description = getString(formData, "description");
  const maxMembers = getInt(formData, "maxMembers", 2);

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("로그인이 필요합니다.");

  const imageFile = formData.get("imageFile");
  const imageUrl =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadCrewImage({ userId: user.id, file: imageFile })
      : "";

  const scheduledAt = convertKSTToUTC(dateTimeLocal);
  const scheduledAtText = formatKSTDateTime(dateTimeLocal);

  const crew = await createCrew({
    title,
    imageUrl,
    category,
    locationText: location,
    scheduledAtText,
    scheduledAt,
    maxMembers,
    description,
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/my-crews");

  return { crewId: crew.id };
}

export async function joinCrewAction(crewId: string) {
  return await joinCrew(crewId);

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/my-crews");
}


