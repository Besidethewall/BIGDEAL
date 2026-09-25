"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Login failed.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFAEB]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 border border-[#CBC9C0] bg-white p-8"
      >
        <h1 className="text-center text-2xl font-black">ADMIN LOGIN</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          className="w-full border-b border-[#CBC9C0] bg-transparent py-3 outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full border-b border-[#CBC9C0] bg-transparent py-3 outline-none"
        />

        <button
          type="submit"
          className="w-full border border-[#1F1D1A] bg-[#1F1D1A] px-6 py-3 text-[10px] font-bold tracking-[0.16em] text-[#FFFAEB]"
        >
          LOGIN
        </button>
      </form>
    </main>
  );
}