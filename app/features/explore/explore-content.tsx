"use client";

import { useState, useMemo } from "react";
import { CategoryFilter } from "@/features/explore/category-filter";
import { CrewGrid } from "@/features/explore/crew-grid";
import { EmptyState } from "@/features/explore/empty-state";
import type { Category } from "@/lib/data/categories";
import type { Crew } from "@/lib/data/crews";

interface ExploreContentProps {
  initialCrews: Crew[];
  categories: Category[];
}

export function ExploreContent({
  initialCrews,
  categories,
}: ExploreContentProps) {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filteredCrews = useMemo(() => {
    if (activeCategory === "전체") {
      return initialCrews;
    }
    return initialCrews.filter((crew) => crew.category === activeCategory);
  }, [activeCategory, initialCrews]);

  function handleJoinCrew(crewId: string | number) {
    // TODO: 크루 참여 로직
    console.log("크루 참여:", crewId);
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

