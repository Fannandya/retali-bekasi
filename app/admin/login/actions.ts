"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { getExpiryTimestamp, getCookieOptions, getTimeoutCookieName } from "@/lib/timeout";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(_prev: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Email atau kata sandi tidak valid" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    getTimeoutCookieName(),
    String(getExpiryTimestamp()),
    getCookieOptions()
  );

  return { success: true };
}
