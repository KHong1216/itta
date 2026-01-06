import { getCurrentUserInfo } from "@/lib/auth";
import { HeaderClient } from "@/components/header-client";

export async function Header() {
  const user = await getCurrentUserInfo();
  return <HeaderClient initialUserEmail={user?.email ?? null} />;
}

