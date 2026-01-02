"use client";

import {
  Home,
  Palette,
  Coffee,
  Music,
  Camera,
  BookOpen,
  Dumbbell,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/data/categories";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Home,
  Palette,
  Coffee,
  Music,
  Camera,
  BookOpen,
  Dumbbell,
  UtensilsCrossed,
};

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-slate-100">
      {categories.map((cat) => {
        const Icon = iconMap[cat.iconName];
        return (
          <Button
            key={cat.name}
            onClick={() => onCategoryChange(cat.name)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
              activeCategory === cat.name
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            )}
          >
            {Icon && <Icon className="w-5 h-5" />} {cat.name}
          </Button>
        );
      })}
    </div>
  );
}

