import Link from "next/link";
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
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-black text-slate-900">크루 채팅</div>
        <Link
          href="/my-crews"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          나의 크루로
        </Link>
      </div>

      <ChatClient
        crewId={crewId}
        initialMessages={messages}
        currentUserId={user?.id ?? null}
      />
    </div>
  );
}


