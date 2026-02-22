"use client";

import { useEffect, useState } from "react";
import type { TeamMember } from "@/app/types/team";
import { getJurcyNumber, getName, getSize, getPhone } from "@/app/types/team";

export function JuryList() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data: TeamMember[] | { error?: string }) => {
        if (data && typeof (data as { error?: string }).error === "string") {
          setError((data as { error: string }).error);
          setMembers([]);
        } else {
          setMembers(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch(() => setError("Could not load jury list. Check setup."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-amber-200/50 bg-amber-500/5 p-8 text-center">
        <p className="text-amber-800/80">Loading jury assignments…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-500/10 p-6 text-center">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <p className="mt-2 text-sm text-red-700/80 dark:text-red-300/80">
          Make sure GOOGLE_SHEETS_SCRIPT_URL is set and your Apps Script is deployed.
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200/50 bg-amber-500/5 p-8 text-center">
        <p className="text-amber-800/80">No entries yet. Be the first to submit your jury info!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-amber-200/50 bg-white shadow-lg dark:border-amber-900/50 dark:bg-zinc-900/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left">
          <thead>
            <tr className="border-b border-amber-200/60 bg-amber-500/10 dark:border-amber-800/60">
              <th className="px-4 py-3 font-semibold text-amber-900 dark:text-amber-100">
                Jurcy #
              </th>
              <th className="px-4 py-3 font-semibold text-amber-900 dark:text-amber-100">
                Name
              </th>
              <th className="px-4 py-3 font-semibold text-amber-900 dark:text-amber-100">
                Size
              </th>
              <th className="hidden px-4 py-3 font-semibold text-amber-900 dark:text-amber-100 sm:table-cell">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr
                key={i}
                className="border-b border-amber-100/50 dark:border-amber-900/30 hover:bg-amber-500/5"
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {getJurcyNumber(m)}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {getName(m)}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {getSize(m)}
                </td>
                <td className="hidden px-4 py-3 text-zinc-600 dark:text-zinc-400 sm:table-cell">
                  {getPhone(m)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
