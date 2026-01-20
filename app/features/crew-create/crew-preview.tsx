"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CrewCard } from "@/features/crew-card";
import type { CreateCrewFormData } from "./types";

interface CrewPreviewProps {
  formData: CreateCrewFormData;
}

function getCategoryImage(category: string): string {
  const categoryImages: Record<string, string> = {
    전시: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
    카페: "https://images.unsplash.com/photo-1501339847302-ac426a4c7c6c?w=800",
    산책: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    공연: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
  };
  return categoryImages[category] || categoryImages["전시"];
}

function formatDateTime(dateTimeLocal: string): string {
  if (!dateTimeLocal) return "일시를 입력하세요";
  
  try {
    const date = new Date(dateTimeLocal);
    const kstOffset = 9 * 60;
    const kstTime = date.getTime() + kstOffset * 60000;
    const kstDate = new Date(kstTime);
    
    return format(kstDate, "yyyy년 M월 d일 (EEE) HH:mm", { locale: ko });
  } catch {
    return "일시를 입력하세요";
  }
}

export function CrewPreview({ formData }: CrewPreviewProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="sticky top-24">
        <h3 className="text-lg font-black text-slate-900 mb-4 px-2">미리보기</h3>
        <div className="opacity-80 scale-95 origin-top pointer-events-none">
          <CrewCard
            id="preview"
            image={formData.image || getCategoryImage(formData.category)}
            category={formData.category || "전시"}
            title={formData.title || "크루 제목을 입력하세요"}
            location={formData.location || "장소를 입력하세요"}
            date={formatDateTime(formData.date)}
            members={1}
            maxMembers={formData.maxMembers || 5}
          />
        </div>
      </div>
    </div>
  );
}

