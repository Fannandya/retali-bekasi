"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { assertAdmin } from "@/lib/auth/assert-admin";

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
