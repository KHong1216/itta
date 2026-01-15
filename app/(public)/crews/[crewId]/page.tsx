import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchCrewById } from "@/lib/supabase/crews";
import { isMemberOfCrew } from "@/lib/supabase/memberships";
import { CrewDetailActions } from "./detail-actions";

interface PageProps {
  params: Promise<{ crewId: string }>;
}

export default async function CrewDetailPage({ params }: PageProps) {
  const { crewId } = await params;

  const crew = await fetchCrewById(crewId);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = Boolean(user);
  const isJoined = isLoggedIn ? await isMemberOfCrew(crewId) : false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-[1fr_auto] items-center mb-6">
        <Link
          href="/explore"
          className="inline-flex items-center justify-self-start gap-1 px-3 py-2 rounded-xl text-sm font-black text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          크루 목록
        </Link>
        <div className="inline-flex items-center justify-self-end px-3 py-1.5 rounded-full bg-slate-100 text-sm font-black text-slate-700">
          {crew.members_count}/{crew.max_members}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
        <div className="relative h-72 overflow-hidden bg-slate-100">
          <img
            src={crew.image_url}
            alt={crew.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">
            {crew.category}
          </div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            {crew.title}
          </h1>

          <div className="mt-5 space-y-2 text-slate-600 font-medium">
            <div>장소: {crew.location_text}</div>
            <div>일시: {crew.scheduled_at_text}</div>
          </div>

          <div className="mt-8">
            <div className="text-sm font-black text-slate-900 mb-2">설명</div>
            <p className="text-slate-600 whitespace-pre-wrap">
              {crew.description || "설명이 아직 없어요."}
            </p>
          </div>

          <div className="mt-10">
            <CrewDetailActions
              crewId={crewId}
              isJoined={isJoined}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

