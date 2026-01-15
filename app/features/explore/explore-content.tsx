"use client";

import { useDeferredValue, useState, useMemo } from "react";
import { CategoryFilter } from "@/features/explore/category-filter";
import { CrewGrid } from "@/features/explore/crew-grid";
import { EmptyState } from "@/features/explore/empty-state";
import type { Category } from "@/lib/data/categories";
import type { Crew } from "@/lib/data/crews";
import { joinCrewAction } from "@/lib/crew-actions";

interface ExploreContentProps {
  initialCrews: Crew[];
  categories: Category[];
}

export function ExploreContent({
  initialCrews,
  categories,
}: ExploreContentProps) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const deferredCategory = useDeferredValue(activeCategory);

  const filteredCrews = useMemo(() => {
    if (deferredCategory === "전체") {
      return initialCrews;
    }
    return initialCrews.filter((crew) => crew.category === deferredCategory);
  }, [deferredCategory, initialCrews]);

  async function handleJoinCrew(crewId: string | number) {
    try {
      const result = await joinCrewAction(String(crewId));
      if (result?.alreadyJoined) alert("이미 참여중인 크루예요.");
      else alert("참여했어요.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "참여에 실패했어요.");
    }
  }

  return (
    <>
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredCrews.length > 0 ? (
        <CrewGrid crews={filteredCrews} onJoinCrew={handleJoinCrew} />
      ) : (
        <EmptyState />
      )}
    </>
  );
}

