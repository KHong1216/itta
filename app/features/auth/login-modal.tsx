"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginHeader } from "./login-header";
import { LoginForm } from "./login-form";
import { SocialLoginButtons } from "./social-login-buttons";
import { LoginFooter } from "./login-footer";
import { SignupForm } from "./signup-form";
import { signUpWithEmail } from "@/lib/auth";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: (email: string, password: string) => void;
  onKakaoLogin?: () => void;
  onGoogleLogin?: () => void;
  onPasswordFind?: () => void;
  onSignup?: () => void;
}

export function LoginModal({
  open,
  onOpenChange,
  onLogin,
  onKakaoLogin,
  onGoogleLogin,
  onPasswordFind,
}: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "signup_done">("login");

  function handleLogin(email: string, password: string) {
    onLogin?.(email, password);
  }

  async function handleSignup(params: {
    email: string;
    password: string;
    nickname: string;
  }) {
    const result = await signUpWithEmail(params.email, params.password, params.nickname);
    if (result?.error) {
      alert(result.error);
      return;
    }
    setMode("signup_done");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-10 rounded-[2.5rem] overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {mode === "signup" ? "회원가입" : "로그인"}
        </DialogTitle>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <LoginHeader />

        {mode === "login" ? (
          <>
            <div className="space-y-4">
              <LoginForm onSubmit={handleLogin} />
              <SocialLoginButtons
                onKakaoLogin={onKakaoLogin}
                onGoogleLogin={onGoogleLogin}
              />
            </div>
            <LoginFooter
              onPasswordFind={onPasswordFind}
              onSignup={() => setMode("signup")}
            />
          </>
        ) : mode === "signup" ? (
          <>
            <div className="space-y-4">
              <SignupForm onSubmit={handleSignup} />
            </div>
            <div className="mt-8 flex justify-center gap-4 text-xs font-bold text-slate-400">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="cursor-pointer hover:text-indigo-600 transition-colors"
              >
                로그인으로 돌아가기
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="text-sm font-black text-slate-900">
                이메일 인증이 필요해요
              </div>
              <div className="text-sm text-slate-500 mt-2 leading-relaxed">
                가입한 이메일로 인증 링크를 보냈어요. 메일함에서 인증을 완료한 뒤 로그인해 주세요.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-slate-100 transition-all transform hover:scale-[1.01] active:scale-95"
            >
              로그인하기
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

