"use client";

interface LoginFooterProps {
  onPasswordFind?: () => void;
  onSignup?: () => void;
}

export function LoginFooter({
  onPasswordFind,
  onSignup,
}: LoginFooterProps) {
  return (
    <div className="mt-8 flex justify-center gap-4 text-xs font-bold text-slate-400">
      <button
        type="button"
        onClick={onPasswordFind}
        className="cursor-pointer hover:text-indigo-600 transition-colors"
      >
        비밀번호 찾기
      </button>
      <span className="text-slate-200">|</span>
      <button
        type="button"
        onClick={onSignup}
        className="cursor-pointer hover:text-indigo-600 transition-colors"
      >
        회원가입
      </button>
    </div>
  );
}

