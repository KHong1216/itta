import { ExploreHeader } from "../../features/explore/explore-header";
import { ExploreContent } from "../../features/explore/explore-content";
import { categories } from "@/lib/data/categories";
import { allCrews } from "@/lib/data/crews";

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <ExploreHeader />
      <ExploreContent initialCrews={allCrews} categories={categories} />
    </div>
  );
}
