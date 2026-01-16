"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUserInfo } from "@/lib/auth";
import { createCrewAction } from "@/lib/crew-actions";

const Dialog = dynamic(
  () => import("@/components/ui/dialog").then((mod) => ({ default: mod.Dialog })),
  { ssr: false }
);

const DialogContent = dynamic(
  () => import("@/components/ui/dialog").then((mod) => ({ default: mod.DialogContent })),
  { ssr: false }
);

const DialogTitle = dynamic(
  () => import("@/components/ui/dialog").then((mod) => ({ default: mod.DialogTitle })),
  { ssr: false }
);

const DialogTrigger = dynamic(
  () => import("@/components/ui/dialog").then((mod) => ({ default: mod.DialogTrigger })),
  { ssr: false }
);

const CreateCrewForm = dynamic(
  () => import("@/features/crew-create/create-crew-form").then((mod) => ({
    default: mod.CreateCrewForm,
  })),
  { ssr: false }
);

interface HeroSectionProps {
  badgeText?: string;
  heading?: string;
  headingAccent?: string;
  description?: string;
  descriptionHighlight?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
}

export function HeroSection({
  badgeText = "오늘의 취향을 내일의 인연으로",
  heading = "당신의 취향을",
  headingAccent = "잇다.",
  description = "전시, 카페, 산책, 공연—혼자 하기 아쉬운 모든 순간.",
  descriptionHighlight = "오늘을 공유할 크루",
  primaryButtonText = "지금 크루 참여하기",
  primaryButtonHref = "/explore",
  secondaryButtonText = "크루 만들기",
}: HeroSectionProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      await createCrewAction(formData);
      setIsDialogOpen(false);
      alert("크루가 생성됐어요.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "크루 생성에 실패했어요.");
    }
  }

  async function handleCreateClick() {
    const user = await getCurrentUserInfo();
    if (!user) {
      router.push("/?login=1&openCreate=1");
      return;
    }
    setIsDialogOpen(true);
  }

  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold bg-indigo-50 text-indigo-800 mb-8 border border-indigo-200">
          {badgeText}
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 text-slate-900">
          {heading}
          <br />
          사람과 <span className="text-indigo-700">{headingAccent}</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-2xl text-slate-700 max-w-3xl mx-auto mb-12 leading-relaxed">
          {description}
          <br />
          복잡한 관계의 부담은 덜어내고,{" "}
          <span className="text-slate-900 font-bold underline underline-offset-4 decoration-indigo-400">
            {descriptionHighlight}
          </span>
          을 만나보세요.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link href={primaryButtonHref}>
            <Button
              className={cn(
                "h-[60px] px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 inline-flex items-center justify-center shrink-0"
              )}
            >
              {primaryButtonText}
            </Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              onClick={handleCreateClick}
              className={cn(
                "h-[60px] px-10 py-5 bg-white border-2 border-slate-200 hover:border-indigo-600 text-slate-700 hover:text-indigo-600 rounded-2xl font-bold text-xl transition-all transform hover:-translate-y-1 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              )}
            >
              <PlusCircle className="w-6 h-6" aria-hidden="true" />
              {secondaryButtonText}
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
              <DialogTitle className="sr-only">크루 만들기</DialogTitle>
              <CreateCrewForm
                onSubmit={handleSubmit}
                onBack={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-100 rounded-full blur-[100px]"></div>
      </div>
    </section>
  );
}

