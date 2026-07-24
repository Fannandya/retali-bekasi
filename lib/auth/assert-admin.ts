import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as unknown as { data: { role: string } | null };

  if (!profile || profile.role !== "admin") throw new Error("Unauthorized");
}
