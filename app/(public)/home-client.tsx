"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Palette,
  Coffee,
  Music,
  Camera,
  BookOpen,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/categoty-section";
import { CrewSection } from "@/components/crew-section";
import { Footer } from "@/components/footer";
import { joinCrewAction } from "@/lib/crew-actions";
import type { Crew } from "@/lib/data/crews";

interface HomeClientProps {
  crews: Crew[];
}

const categories = [
  { name: "전체", icon: <Home className="w-5 h-5" /> },
  { name: "전시", icon: <Palette className="w-5 h-5" /> },
  { name: "카페", icon: <Coffee className="w-5 h-5" /> },
  { name: "공연", icon: <Music className="w-5 h-5" /> },
  { name: "사진", icon: <Camera className="w-5 h-5" /> },
  { name: "독서", icon: <BookOpen className="w-5 h-5" /> },
  { name: "운동", icon: <Dumbbell className="w-5 h-5" /> },
  { name: "맛집", icon: <UtensilsCrossed className="w-5 h-5" /> },
];

export function HomeClient({ crews }: HomeClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("전체");

  function handleViewMore() {
    router.push("/explore");
  }

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
      <HeroSection primaryButtonHref="/explore" secondaryButtonText="크루 만들기" />
      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <CrewSection crews={crews} onViewMore={handleViewMore} onJoinCrew={handleJoinCrew} />
      <Footer />
    </>
  );
}


