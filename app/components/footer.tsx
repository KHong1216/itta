import Link from "next/link";
import { LinkIcon } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  tagline?: string;
  links?: FooterLink[];
}

export function Footer({
  tagline = "우리의 만남은 취향으로부터 시작됩니다.",
  links = [
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#" },
    { label: "문의하기", href: "#" },
  ],
}: FooterProps) {
  return (
    <footer className="bg-white py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
            <LinkIcon className="w-3 h-3 text-white" />
          </Link>
          <Link href="/" className="text-xl font-black text-slate-900">
            잇다 ITTA
          </Link>
        </div>
        <p className="text-slate-400 font-medium">{tagline}</p>
        <div className="mt-8 flex gap-8 text-sm font-bold text-slate-400">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

