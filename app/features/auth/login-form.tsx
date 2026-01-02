"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit?.(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative group">
        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all text-sm"
          required
        />
      </div>
      <div className="relative group">
        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 transition-all transform hover:scale-[1.01] active:scale-95"
      >
        로그인하기
      </button>
    </form>
  );
}

