"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BackButton } from "./back-button";
import { CreateCrewHeader } from "./create-crew-header";
import { ImageUpload } from "./image-upload";
import { CrewPreview } from "./crew-preview";
import { cn } from "@/lib/utils";
import type { CreateCrewFormData } from "./types";

interface CreateCrewFormProps {
  onSubmit?: (data: CreateCrewFormData) => void;
  onBack?: () => void;
}

const initialFormData: CreateCrewFormData = {
  title: "",
  image: "",
  category: "전시",
  maxMembers: 5,
  location: "",
  date: "",
};

export function CreateCrewForm({ onSubmit, onBack }: CreateCrewFormProps) {
  const [formData, setFormData] = useState<CreateCrewFormData>(initialFormData);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(formData);
  }

  function updateFormData(updates: Partial<CreateCrewFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton onClick={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
          <CreateCrewHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1">
                크루 제목
              </label>
              <input
                required
                placeholder="예) 전시회 같이 관람해요"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
              />
            </div>

            <ImageUpload
              image={formData.image}
              onImageChange={(image) => updateFormData({ image })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1">
                  카테고리
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData({ category: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-medium appearance-none cursor-pointer"
                >
                  <option value="전시">🖼️ 전시</option>
                  <option value="카페">☕ 카페</option>
                  <option value="산책">🍃 산책</option>
                  <option value="공연">🎻 공연</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1">
                  최대 정원
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={formData.maxMembers}
                  onChange={(e) =>
                    updateFormData({ maxMembers: parseInt(e.target.value) || 2 })
                  }
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1">
                  장소
                </label>
                <input
                  required
                  placeholder="서울 어딘가"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1">
                  일시
                </label>
                <input
                  required
                  placeholder="오늘 오후"
                  value={formData.date}
                  onChange={(e) => updateFormData({ date: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
            >
              작성 완료
            </button>
          </form>
        </div>

        <CrewPreview formData={formData} />
      </div>
    </div>
  );
}

