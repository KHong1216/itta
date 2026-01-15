import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { fetchCrewMessages } from "@/lib/supabase/chat";
import { ChatClient } from "./chat-client";

interface PageProps {
  params: Promise<{ crewId: string }>;
}

export default async function CrewChatPage({ params }: PageProps) {
  const { crewId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const messages = await fetchCrewMessages(crewId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-6">
        <Link
          href="/my-crews"
          className="inline-flex items-center justify-self-start gap-1 px-3 py-2 rounded-xl text-sm font-black text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          나의 크루
        </Link>
        <div className="text-2xl font-black text-slate-900 text-center justify-self-center">
          크루 채팅
        </div>
        <div />
      </div>

      <ChatClient
        crewId={crewId}
        initialMessages={messages}
        currentUserId={user?.id ?? null}
      />
    </div>
  );
}


