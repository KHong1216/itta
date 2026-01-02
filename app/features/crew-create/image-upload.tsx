"use client";

import { useRef } from "react";
import { Upload, Camera } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  image: string;
  onImageChange: (imageUrl: string) => void;
}

export function ImageUpload({ image, onImageChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-900 ml-1">
        대표 이미지 첨부
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer"
      >
        <div
          className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
            image
              ? "border-indigo-600 bg-indigo-50"
              : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-400"
          }`}
        >
          {image ? (
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <Image
                src={image}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="font-bold text-slate-600">클릭하여 사진 첨부</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG (최대 5MB)</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}

