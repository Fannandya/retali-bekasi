"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateSettings() {
  revalidateTag("settings", "max");
  revalidatePath("/[locale]", "page");
}

export async function revalidatePackages() {
  revalidatePath("/[locale]/umroh", "page");
  revalidatePath("/[locale]/haji", "page");
  revalidatePath("/[locale]", "page");
}

export async function revalidateNews() {
  revalidatePath("/[locale]/kabar", "page");
  revalidatePath("/[locale]", "page");
}

export async function revalidateTestimonials() {
  revalidatePath("/[locale]/testimoni", "page");
  revalidatePath("/[locale]", "page");
}
