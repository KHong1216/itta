"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { joinCrewAction } from "@/lib/crew-actions";

interface CrewDetailActionsProps {
  crewId: string;
  isJoined: boolean;
  isLoggedIn: boolean;
}

export function CrewDetailActions({
  crewId,
  isJoined,
  isLoggedIn,
}: CrewDetailActionsProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  async function handleJoin() {
    if (!isLoggedIn) {
      router.push(`/?login=1&next=/crews/${crewId}`);
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinCrewAction(crewId);
      if (result?.alreadyJoined) alert("이미 참여중인 크루예요.");
      else alert("참여했어요.");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "참여에 실패했어요.");
    } finally {
      setIsJoining(false);
    }
  }

  if (isJoined) {
    return (
      <Link
        href={`/crews/${crewId}/chat`}
        className="inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-indigo-600 transition-colors"
      >
        채팅방 입장
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleJoin}
      disabled={isJoining}
      className="inline-flex items-center justify-center w-full px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
    >
      {isJoining ? "참여 중..." : "잇기"}
    </button>
  );
}

