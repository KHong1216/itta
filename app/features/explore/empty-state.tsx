import { Search } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "해당 카테고리의 크루가 아직 없네요.",
}: EmptyStateProps) {
  return (
    <div className="text-center py-32 text-slate-400">
      <Search className="w-16 h-16 mx-auto mb-4 opacity-10" />
      <p className="text-xl">{message}</p>
    </div>
  );
}

