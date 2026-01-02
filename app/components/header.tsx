"use client";

import { useState } from "react";
import Link from "next/link";
import { LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCrewForm } from "@/features/crew-create/create-crew-form";
import { LoginModal } from "@/features/auth/login-modal";
import { cn } from "@/lib/utils";
import { signInWithEmail } from "@/lib/auth";

export function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  function handleSubmit() {
    // TODO: 크루 생성 로직
    setIsDialogOpen(false);
  }

  async function handleLogin(email: string, password: string) {
    const result = await signInWithEmail(email, password);
    if(result?.error){
        alert(result.error);
    }else{
        alert("로그인 성공");
    }
    setIsLoginModalOpen(false);
    window.location.reload();
  }

  function handleKakaoLogin() {
    // TODO: 카카오 로그인 로직
    console.log("Kakao login");
  }

  function handleGoogleLogin() {
    // TODO: 구글 로그인 로직
    console.log("Google login");
  }

  function handlePasswordFind() {
    // TODO: 비밀번호 찾기 로직
    console.log("Password find");
  }

  function handleSignup() {
    // TODO: 회원가입 로직
    console.log("Signup");
  }

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </Link>
            <Link href="/" className="text-2xl font-black text-slate-900 tracking-tighter">
              잇다<span className="text-indigo-600">ITTA</span>
            </Link>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="items-center space-x-8 text-sm font-semibold text-slate-500">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/explore"
                  className={cn(
                    "hover:text-indigo-600 transition-colors",
                    "data-active:text-indigo-600"
                  )}
                >
                  크루 보기
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger
                    className={cn(
                      "hover:text-indigo-600 transition-colors",
                      "data-active:text-indigo-600"
                    )}
                  >
                    크루 만들기
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                    <CreateCrewForm
                      onSubmit={handleSubmit}
                      onBack={() => setIsDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className={cn(
                    "px-5 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-sm"
                  )}
                >
                  로그인
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onLogin={handleLogin}
        onKakaoLogin={handleKakaoLogin}
        onGoogleLogin={handleGoogleLogin}
        onPasswordFind={handlePasswordFind}
        onSignup={handleSignup}
      />
    </div>
  );
}

