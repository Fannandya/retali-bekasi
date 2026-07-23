const COOKIE_NAME = "admin_expires_at";
const DURATION_MINUTES = 30;

export function getTimeoutCookieName(): string {
  return COOKIE_NAME;
}

export function getDurationMinutes(): number {
  return DURATION_MINUTES;
}

export function getExpiryTimestamp(): number {
  return Date.now() + DURATION_MINUTES * 60 * 1000;
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/admin",
    maxAge: DURATION_MINUTES * 60,
  };
}
