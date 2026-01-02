import { LinkIcon } from "lucide-react";

export function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100 rotate-3">
        <LinkIcon className="w-7 h-7 text-white" />
      </div>
      <h2 className="text-2xl font-black text-slate-900">다시 뵐 줄 알았어요!</h2>
      <p className="text-slate-500 font-medium text-sm mt-1 text-balance">
        잇다(ITTA)에서 당신의 취향을 이어보세요.
      </p>
    </div>
  );
}

