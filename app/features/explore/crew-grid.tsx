"use client";

import { CrewCard } from "@/features/crew-card";
import type { Crew } from "@/lib/data/crews";

interface CrewGridProps {
  crews: Crew[];
  onJoinCrew?: (crewId: string | number) => void;
}

export function CrewGrid({ crews, onJoinCrew }: CrewGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
  );
}

