"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { TeamMember } from "@/app/types/team";
import { getJurcyNumber } from "@/app/types/team";

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

export default function SubmitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [size, setSize] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [takenJerseyNumbers, setTakenJerseyNumbers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/team")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TeamMember[] | { error?: string }) => {
        if (Array.isArray(data)) {
          const taken = new Set(
            data.map((m) => (getJurcyNumber(m) ?? "").trim()).filter(Boolean)
          );
          setTakenJerseyNumbers(taken);
        }
      })
      .catch(() => {});
  }, []);

  const jerseyTaken =
    jerseyNumber.trim() !== "" && takenJerseyNumbers.has(jerseyNumber.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          jerseyNumber: jerseyNumber.trim(),
          size: size.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Try again.");
        return;
      }
      router.push("/?submitted=1");
    } catch {
      setErrorMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-amber-400 transition"
        >
          ← Back to HOT GANG
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Submit your info
          </span>
        </h1>
        <p className="mt-2 text-zinc-400">
          Add your jersey number, name, size, and phone. It will be saved and shown to the team.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 space-y-5"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-amber-100">
              Your name (jersey name)
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-800/50 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="e.g. Asif Ahammad"
            />
          </div>
          <div>
            <label htmlFor="jerseyNumber" className="block text-sm font-medium text-amber-100">
              Jersey number
            </label>
            <p className="mt-0.5 text-xs text-zinc-500">
              Each number can only be chosen once. If someone has already taken it, pick another.
            </p>
            <input
              id="jerseyNumber"
              type="text"
              required
              value={jerseyNumber}
              onChange={(e) => setJerseyNumber(e.target.value)}
              className={`mt-1 w-full rounded-lg border bg-zinc-800/50 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                jerseyTaken
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-600 focus:border-amber-500 focus:ring-amber-500"
              }`}
              placeholder="e.g. 7"
              aria-invalid={jerseyTaken}
            />
            {jerseyTaken && (
              <p className="mt-1.5 text-sm text-red-400">
                This jersey number is already taken. Please choose another.
              </p>
            )}
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-amber-100">
              Size
            </label>
            <p className="mt-0.5 text-xs text-zinc-500">
              Check the size chart on the home page (Chest & Height in inches) if you need help.
            </p>
            <select
              id="size"
              required
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-800/50 px-4 py-2.5 text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="">Select size</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-amber-100">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-600 bg-zinc-800/50 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="e.g. 01789846204"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-red-500/20 text-red-300 text-sm py-2 px-3">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || jerseyTaken}
            className="w-full rounded-full bg-amber-500 py-3 font-semibold text-zinc-900 transition hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
