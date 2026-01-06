import Link from "next/link";
import { fetchMyCrews } from "@/lib/supabase/memberships";
import { getCurrentUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MyCrewsPage() {
  const user = await getCurrentUserInfo();
  if (!user) redirect("/?login=1&next=/my-crews");

  const memberships = await fetchMyCrews();

  if (memberships.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-100 p-10">
          <h1 className="text-3xl font-black text-slate-900">나의 크루</h1>
          <p className="text-slate-500 mt-3">
            아직 참여한 크루가 없어요. 마음에 드는 크루를 찾아 잇기 해보세요.
          </p>
          <div className="mt-8">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-colors"
            >
              크루 보러가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">나의 크루</h1>
          <p className="text-slate-500 mt-2">
            내가 참여한 크루 {memberships.length}개
          </p>
        </div>
        <Link
          href="/explore"
          className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
        >
          크루 더 찾기
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {memberships.map((membership) => (
          <div
            key={membership.crewId}
            className="bg-white rounded-[2rem] border border-slate-100 p-8 hover:shadow-3xl transition-all duration-500"
          >
            <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">
              {membership.crew.category}
            </div>
            <div className="mt-3 text-xl font-bold text-slate-900 line-clamp-1">
              {membership.crew.title}
            </div>
            <div className="mt-4 text-sm text-slate-500 space-y-1">
              <div className="line-clamp-1">{membership.crew.location_text}</div>
              <div className="line-clamp-1">{membership.crew.scheduled_at_text}</div>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="text-sm font-bold text-slate-400">
                {membership.crew.members_count}/{membership.crew.max_members}
              </div>
              <div className="text-xs font-bold text-slate-400">
                {membership.role === "owner" ? "호스트" : "멤버"}
              </div>
            </div>
            <div className="mt-5">
              <Link
                href={`/crews/${membership.crewId}/chat`}
                className="inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-indigo-600 transition-colors"
              >
                채팅방 입장
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


