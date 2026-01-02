"use client";

import { MessageSquare } from "lucide-react";

interface SocialLoginButtonsProps {
  onKakaoLogin?: () => void;
  onGoogleLogin?: () => void;
}

export function SocialLoginButtons({
  onKakaoLogin,
  onGoogleLogin,
}: SocialLoginButtonsProps) {
  return (
    <>
      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-slate-300 uppercase tracking-tighter">
          또는 간편 로그인
        </span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onKakaoLogin}
          className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FEE500] hover:bg-[#FDE100] text-[#191919] rounded-2xl font-bold text-xs transition-all active:scale-[0.98]"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          카카오
        </button>
        <button
          type="button"
          onClick={onGoogleLogin}
          className="flex items-center justify-center gap-2 py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs transition-all active:scale-[0.98]"
        >
          <img
            src="https://www.google.com/favicon.ico"
            className="w-4 h-4"
            alt="google"
          />
          구글
        </button>
      </div>
    </>
  );
}

