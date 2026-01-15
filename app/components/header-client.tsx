"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginModal } from "@/features/auth/login-modal";
import { CreateCrewForm } from "@/features/crew-create/create-crew-form";
import { createCrewAction } from "@/lib/crew-actions";
import { cn } from "@/lib/utils";
import { signInWithEmail, signOut } from "@/lib/auth";

interface HeaderClientProps {
  initialUserEmail: string | null;
}

const ITTA_TAB_SESSION_KEY = "itta_tab_session_ok";

function isSafeNextPath(nextPath: string | null) {
  return typeof nextPath === "string" && nextPath.startsWith("/");
}

export function HeaderClient({ initialUserEmail }: HeaderClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUserEmail, setCurrentUserEmail] = useState(initialUserEmail);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isLoginRequested = searchParams.get("login") === "1";
  const shouldOpenCreateRequested = searchParams.get("openCreate") === "1";
  const nextPath = searchParams.get("next");

  const isCreateDialogOpen =
    isDialogOpen || (shouldOpenCreateRequested && !!currentUserEmail);

  const isLoginOpen =
    isLoginModalOpen || (isLoginRequested && !currentUserEmail);

  // "탭을 닫았다가 다시 열면 로그아웃" 정책:
  // - 쿠키는 탭 간 공유라서 완전한 탭 단위 로그인 유지/해제는 어렵다.
  // - 대신 이 탭(sessionStorage)에 "로그인한 흔적"이 없으면 자동으로 signOut 처리한다.
  useEffect(() => {
    if (!currentUserEmail) return;

    function handlePageShow() {
      let hasTabSession = false;
      try {
        hasTabSession = sessionStorage.getItem(ITTA_TAB_SESSION_KEY) === "1";
      } catch {
        // ignore
      }

      if (hasTabSession) return;

      void (async () => {
        setCurrentUserEmail(null);
        await signOut();
        router.refresh();
      })();
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [currentUserEmail, router]);

  function clearHomeQuery() {
    if (!searchParams.size) return;
    router.replace("/");
  }

  function clearLoginQueryKeepOpenCreate() {
    if (!isLoginRequested) return;
    if (shouldOpenCreateRequested) router.replace("/?openCreate=1");
    else router.replace("/");
  }

  function openLoginForCreateCrew() {
    router.push("/?login=1&openCreate=1");
  }

  async function handleSubmit(formData: FormData) {
    try {
      await createCrewAction(formData);
      setIsDialogOpen(false);
      alert("크루가 생성됐어요.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "크루 생성에 실패했어요.");
    }
  }

  async function handleLogin(email: string, password: string) {
    const result = await signInWithEmail(email, password);

    if (result?.error) {
      alert(result.error);
      return;
    }

    try {
      sessionStorage.setItem(ITTA_TAB_SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setCurrentUserEmail(result?.user?.email ?? email);
    setIsLoginModalOpen(false);
    router.refresh();

    if (isSafeNextPath(nextPath)) {
      router.push(nextPath ?? "/");
      return;
    }

    clearLoginQueryKeepOpenCreate();
  }

  async function handleLogout() {
    setCurrentUserEmail(null);
    try {
      sessionStorage.removeItem(ITTA_TAB_SESSION_KEY);
    } catch {
      // ignore
    }
    await signOut();
    router.refresh();
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
            <Link
              href="/"
              className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
            >
              <LinkIcon className="w-5 h-5 text-white" />
            </Link>
            <Link
              href="/"
              className="text-2xl font-black text-slate-900 tracking-tighter"
            >
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
                {currentUserEmail ? (
                  <NavigationMenuLink
                    href="/my-crews"
                    className={cn(
                      "hover:text-indigo-600 transition-colors",
                      "data-active:text-indigo-600"
                    )}
                  >
                    나의 크루
                  </NavigationMenuLink>
                ) : null}
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open && shouldOpenCreateRequested) clearHomeQuery();
                  }}
                >
                  {currentUserEmail ? (
                    <DialogTrigger
                      className={cn(
                        "hover:text-indigo-600 transition-colors",
                        "data-active:text-indigo-600"
                      )}
                    >
                      크루 만들기
                    </DialogTrigger>
                  ) : (
                    <button
                      type="button"
                      onClick={openLoginForCreateCrew}
                      className={cn(
                        "hover:text-indigo-600 transition-colors",
                        "data-active:text-indigo-600"
                      )}
                    >
                      크루 만들기
                    </button>
                  )}
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogTitle className="sr-only">크루 만들기</DialogTitle>
                    <CreateCrewForm
                      onSubmit={handleSubmit}
                      onBack={() => setIsDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </NavigationMenuItem>
              <NavigationMenuItem>
                {currentUserEmail ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-500">
                      {currentUserEmail}
                    </span>
                    <Button
                      onClick={handleLogout}
                      className={cn(
                        "px-5 py-2.5 rounded-2xl bg-slate-200 text-slate-900 hover:bg-slate-300 transition-all shadow-sm"
                      )}
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsLoginModalOpen(true)}
                    className={cn(
                      "px-5 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-sm"
                    )}
                  >
                    로그인
                  </Button>
                )}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <LoginModal
        open={isLoginOpen}
        onOpenChange={(open) => {
          setIsLoginModalOpen(open);
          if (!open) clearLoginQueryKeepOpenCreate();
        }}
        onLogin={handleLogin}
        onKakaoLogin={handleKakaoLogin}
        onGoogleLogin={handleGoogleLogin}
        onPasswordFind={handlePasswordFind}
        onSignup={handleSignup}
      />
    </div>
  );
}


