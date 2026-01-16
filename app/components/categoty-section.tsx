import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Category {
  name: string;
  icon: ReactNode;
}

interface CategorySectionProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryName: string) => void;
}

export function CategorySection({
  categories,
  activeCategory,
  onCategoryChange,
}: CategorySectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 mb-8">
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar justify-center">
        {categories.map((cat) => (
          <Button
            key={cat.name}
            onClick={() => onCategoryChange(cat.name)}
            className={cn(
              "flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap",
              activeCategory === cat.name
                ? "bg-slate-900 text-white shadow-lg scale-105"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            )}
          >
            {cat.icon}
            {cat.name}
          </Button>
        ))}
      </div>
    </section>
  );
}

