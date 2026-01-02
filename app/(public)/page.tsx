"use client";

import { useState } from "react";
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

const featuredCrews = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
    category: "전시",
    title: "현대미술관 기획전 함께 보기",
    location: "서울시 용산구",
    date: "2024.01.15 (토) 14:00",
    members: 8,
    maxMembers: 12,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4c7c6c?w=800",
    category: "카페",
    title: "한강 카페 투어 크루",
    location: "서울시 마포구",
    date: "2024.01.16 (일) 11:00",
    members: 5,
    maxMembers: 8,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    category: "공연",
    title: "재즈 라이브 콘서트",
    location: "서울시 강남구",
    date: "2024.01.20 (토) 19:00",
    members: 12,
    maxMembers: 15,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    category: "사진",
    title: "벚꽃 사진 크루",
    location: "서울시 종로구",
    date: "2024.04.10 (수) 10:00",
    members: 6,
    maxMembers: 10,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    category: "독서",
    title: "월간 독서 모임",
    location: "서울시 서초구",
    date: "2024.01.25 (목) 19:30",
    members: 9,
    maxMembers: 12,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    category: "맛집",
    title: "홍대 맛집 탐방 크루",
    location: "서울시 마포구",
    date: "2024.01.18 (목) 18:00",
    members: 7,
    maxMembers: 10,
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("전체");

  function handleViewMore() {
    // TODO: 더 보기 페이지로 이동
    console.log("더 보기 클릭");
  }

  function handleJoinCrew(crewId: string | number) {
    // TODO: 크루 참여 로직
    console.log("크루 참여:", crewId);
  }

  return (
    <>
      <HeroSection
        primaryButtonHref="/explore"
        secondaryButtonText="크루 만들기"
      />
      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <CrewSection
        crews={featuredCrews}
        onViewMore={handleViewMore}
        onJoinCrew={handleJoinCrew}
      />
      <Footer />
    </>
  );
}

