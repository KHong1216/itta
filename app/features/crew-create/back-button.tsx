"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
}

export function BackButton({ href = "/", onClick }: BackButtonProps) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        홈으로
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-colors group"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      홈으로
    </Link>
  );
}

