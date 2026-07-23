"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
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

export async function revalidateSettings() {
  await assertAdmin();
  revalidateTag("settings", "max");
  revalidatePath("/[locale]", "page");
}

export async function revalidatePackages() {
  await assertAdmin();
  revalidatePath("/[locale]/umroh", "page");
  revalidatePath("/[locale]/haji", "page");
  revalidatePath("/[locale]", "page");
}

export async function revalidateNews() {
  await assertAdmin();
  revalidatePath("/[locale]/kabar", "page");
  revalidatePath("/[locale]", "page");
}

export async function revalidateTestimonials() {
  await assertAdmin();
  revalidatePath("/[locale]/testimoni", "page");
  revalidatePath("/[locale]", "page");
}
