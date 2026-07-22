"use client";

import { useActionState, useEffect } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: "" });

  useEffect(() => {
    if (state?.success) {
      window.location.href = "/admin";
    }
  }, [state]);

  return (
    <form action={formAction} className="bg-white p-6 rounded-xl border border-line shadow-sm">
      {state?.error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">
          Login berhasil, mengarahkan...
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-1">Kata Sandi</label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
          required
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full btn btn-primary justify-center"
      >
        {pending ? "Memuat..." : "Masuk"}
      </button>
    </form>
  );
}
