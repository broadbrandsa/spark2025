"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type GateState = "checking" | "locked" | "unlocked";

export function AccessGate() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<GateState>("checking");
  const [error, setError] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    fetch("/api/access", { method: "GET" })
      .then(async (res) => {
        if (!mounted) return;
        if (!res.ok) {
          setState("locked");
          return;
        }
        const data = (await res.json()) as { unlocked?: boolean };
        setState(data.unlocked ? "unlocked" : "locked");
      })
      .catch(() => {
        if (mounted) setState("locked");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleLock = () => {
      setState("locked");
      setInput("");
      setError(false);
    };
    window.addEventListener("spark-report-lock", handleLock);
    return () => window.removeEventListener("spark-report-lock", handleLock);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: input.trim() }),
    });

    if (!response.ok) {
      setError(true);
      return;
    }

    setError(false);
    setState("unlocked");
    if (pathname === "/access") {
      router.replace("/");
    }
  };

  if (state === "unlocked") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
      <div className="relative w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Enter Access Code</h2>
        <p className="mt-2 text-sm text-slate-500">Please enter the 4-digit code to continue.</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label htmlFor="access-code" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Access Code
            </label>
            <input
              id="access-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={4}
              value={input}
              onChange={(event) => {
                const next = event.target.value.replace(/[^0-9]/g, "");
                setInput(next);
                if (error) setError(false);
              }}
              className={`w-full rounded-lg border px-4 py-3 text-base font-semibold tracking-[0.3em] outline-none transition ${
                error ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-slate-500"
              }`}
            />
            {error && <p className="text-xs text-red-600">Incorrect code. Try again.</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#2B0430] px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#3a0a41]"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
