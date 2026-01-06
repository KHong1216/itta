import { MapPin, Calendar } from "lucide-react";
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
}: CrewCardProps) {
  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-3xl transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-xs font-black text-indigo-600 shadow-xl uppercase tracking-widest">
          {category}
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <MapPin className="w-4 h-4 text-indigo-400" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Calendar className="w-4 h-4 text-indigo-400" />
            {date}
          </div>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {Array.from({ length: Math.min(3, members) }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}${i}`}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-400">
              {members}/{maxMembers}
            </span>
          </div>
          <Button
            onClick={onJoin}
            className={cn(
              "px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all"
            )}
          >
            잇기
          </Button>
        </div>
      </div>
    </div>
  );
}

