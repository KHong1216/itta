"use client";

import { useState } from "react";
import { BackButton } from "./back-button";
import { CreateCrewHeader } from "./create-crew-header";
import { ImageUpload } from "./image-upload";
import { CrewPreview } from "./crew-preview";
import { DateTimePicker } from "./date-time-picker";
import type { CreateCrewFormData } from "./types";

interface CreateCrewFormProps {
  onSubmit?: (formData: FormData) => void | Promise<void>;
  onBack?: () => void;
}

const initialFormData: CreateCrewFormData = {
  title: "",
  image: "",
  imageFile: null,
  category: "전시",
  maxMembers: 5,
  location: "",
  date: "",
  description: "",
};

export function CreateCrewForm({ onSubmit, onBack }: CreateCrewFormProps) {
  const [formData, setFormData] = useState<CreateCrewFormData>(initialFormData);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const submitFormData = new FormData();
    submitFormData.set("title", formData.title);
    submitFormData.set("category", formData.category);
    submitFormData.set("maxMembers", String(formData.maxMembers));
    submitFormData.set("location", formData.location);
    submitFormData.set("date", formData.date);
    submitFormData.set("description", formData.description);
    if (formData.imageFile) submitFormData.set("imageFile", formData.imageFile);

    await onSubmit?.(submitFormData);
  }

  function updateFormData(updates: Partial<CreateCrewFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  return (
    <div className="w-full max-w-full mx-auto px-4 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BackButton onClick={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
          <CreateCrewHeader />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1 mb-2 block">
                크루 제목
              </label>
              <input
                required
                placeholder="예) 전시회 같이 관람해요"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300 font-medium transition-all"
              />
            </div>

            <ImageUpload
              image={formData.image}
              onImageChange={(imageFile, previewUrl) =>
                updateFormData({ image: previewUrl, imageFile })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1 mb-2 block">
                  카테고리
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData({ category: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300 font-medium appearance-none cursor-pointer transition-all"
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
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300 font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 ml-1 mb-2 block">
                  장소
                </label>
                <input
                  required
                  placeholder="서울 어딘가"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300 font-medium transition-all h-30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1">
                  일시
                </label>
                <DateTimePicker
                  value={formData.date}
                  onChange={(value) => updateFormData({ date: value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1 mb-2 block">
                자세한 설명
              </label>
              <textarea
                placeholder="예) 초면이라도 어색하지 않게 가벼운 대화로 시작해요. 전시 관람 후 근처 카페에서 1시간 정도 더 이야기해요."
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-300 font-medium transition-all min-h-28 resize-none"
              />
              <p className="text-xs text-slate-500 ml-1">
                장소/시간/분위기/준비물 같은 정보를 적어주면 참여가 쉬워져요.
              </p>
            </div>

            <button
              type="submit"
              className="w-full mt-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
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

