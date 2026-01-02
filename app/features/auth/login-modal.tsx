"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { LoginHeader } from "./login-header";
import { LoginForm } from "./login-form";
import { SocialLoginButtons } from "./social-login-buttons";
import { LoginFooter } from "./login-footer";

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
  onSignup,
}: LoginModalProps) {
  function handleLogin(email: string, password: string) {
    onLogin?.(email, password);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-10 rounded-[2.5rem] overflow-hidden"
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <LoginHeader />
        <div className="space-y-4">
          <LoginForm onSubmit={handleLogin} />
          <SocialLoginButtons
            onKakaoLogin={onKakaoLogin}
            onGoogleLogin={onGoogleLogin}
          />
        </div>
        <LoginFooter
          onPasswordFind={onPasswordFind}
          onSignup={onSignup}
        />
      </DialogContent>
    </Dialog>
  );
}

