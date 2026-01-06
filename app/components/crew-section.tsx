import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrewCard } from "@/features/crew-card";
import { cn } from "@/lib/utils";

interface Crew {
  id: string | number;
  image: string;
  category: string;
  title: string;
  location: string;
  date: string;
  members: number;
  maxMembers: number;
}

interface CrewSectionProps {
  crews: Crew[];
  onViewMore?: () => void;
  onJoinCrew?: (crewId: string | number) => void;
}

export function CrewSection({
  crews,
  onViewMore,
  onJoinCrew,
}: CrewSectionProps) {
  return (
    <>
      {/* Featured Crews */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              함께 이을 크루
            </h2>
            <p className="text-slate-500 mt-3 text-lg">
              지금 이 순간, 당신과 같은 곳을 바라보는 사람들
            </p>
          </div>
          <Button
            onClick={onViewMore}
            className={cn(
              "text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all bg-transparent hover:bg-transparent shadow-none p-0 h-auto"
            )}
          >
            더 보기 <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {crews.map((crew) => (
            <CrewCard
              key={crew.id}
              id={crew.id}
              image={crew.image}
              category={crew.category}
              title={crew.title}
              location={crew.location}
              date={crew.date}
              members={crew.members}
              maxMembers={crew.maxMembers}
              onJoin={() => onJoinCrew?.(crew.id)}
            />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-32 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
            취향을 잇다, 마음을 잇다.
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed mb-16">
            &apos;잇다&apos;는 단순히 한 번 만나는 것에 그치지 않습니다.
            <br />
            좋아하는 것이 닮은 사람들을 발견하고, <br />
            그 찰나의 순간을 소중한 인연의 시작으로 이어줍니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm text-left hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-bold mb-4">가벼운 마음, 깊은 취향</h4>
              <p className="text-slate-500 leading-relaxed">
                준비물은 오직 당신의 취향입니다. 부담 없는 마음으로 오늘의 크루가
                되어보세요.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm text-left hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-rose-500" />
              </div>
              <h4 className="text-2xl font-bold mb-4">연결의 가능성</h4>
              <p className="text-slate-500 leading-relaxed">
                좋은 대화는 좋은 관계로 이어집니다. 당신의 오늘이 누군가에겐 잊지
                못할 시작이 될 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

