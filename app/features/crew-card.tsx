import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CrewCardProps {
  id: string | number;
  image: string;
  category: string;
  title: string;
  location: string;
  date: string;
  members: number;
  maxMembers: number;
  onJoin?: () => void;
  priority?: boolean;
}

export function CrewCard({
  id,
  image,
  category,
  title,
  location,
  date,
  members,
  maxMembers,
  onJoin,
  priority = false,
}: CrewCardProps) {
  return (
    <article className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-3xl transition-all duration-500">
      <Link 
        href={`/crews/${id}`} 
        className="block relative h-64 overflow-hidden"
        aria-label={`${title} 크루 상세 보기`}
      >
        <Image
          src={image}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(min-width: 1024px) 33vw, 100vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          aria-hidden="true"
        />
        <div className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-xs font-black text-indigo-700 shadow-xl uppercase tracking-widest">
          {category}
        </div>
      </Link>
      <div className="p-8">
        <Link href={`/crews/${id}`} aria-label={`${title} 크루 상세 보기`}>
          <h3 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-1 group-hover:text-indigo-700 transition-colors">
            {title}
          </h3>
        </Link>
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <MapPin className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Calendar className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span>{date}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3" aria-label={`${members}명 참여 중`}>
              {Array.from({ length: Math.min(3, members) }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}${i}`}
                    alt=""
                    aria-hidden="true"
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-700">
              {members}/{maxMembers}
            </span>
          </div>
          <Button
            onClick={onJoin}
            className={cn(
              "px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
            )}
            aria-label={`${title} 크루에 참여하기`}
          >
            잇기
          </Button>
        </div>
      </div>
    </article>
  );
}

