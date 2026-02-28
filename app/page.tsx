import Link from "next/link";
import { JuryList } from "./components/JuryList";
import { SubmitSuccessBanner } from "./components/SubmitSuccessBanner";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <SubmitSuccessBanner show={params?.submitted === "1"} />
        {/* Hero */}
        <header className="text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              HOT GANG
            </span>
          </h1>
          <p className="mt-3 text-lg text-zinc-400 sm:text-xl">
            Team info & jury assignments
          </p>
        </header>

        {/* CTA: Submit your info */}
        <section className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-amber-100 sm:text-2xl">
            Submit your info
          </h2>
          <p className="mt-2 text-zinc-400">
            Add your jersey number, name, size, and phone. It will be saved and shown to the team.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-zinc-900 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            Add your info
          </Link>
        </section>

        {/* Size chart – help to choose */}
        <section className="mt-12 rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-zinc-100 sm:text-2xl">
            Our Size Chart
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Use this to pick your size when submitting. All measurements are in inches.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[280px] border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-600">
                  <th className="py-3 pr-4 font-semibold text-zinc-200">SIZE</th>
                  <th className="py-3 pr-4 font-semibold text-zinc-200">CHEST</th>
                  <th className="py-3 font-semibold text-zinc-200">HEIGHT</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {[
                  { size: "S", chest: 36, height: 26 },
                  { size: "M", chest: 38, height: 27 },
                  { size: "L", chest: 40, height: 28 },
                  { size: "XL", chest: 42, height: 29 },
                  { size: "2XL", chest: 44, height: 30 },
                  { size: "3XL", chest: 46, height: 31 },
                  { size: "4XL", chest: 48, height: 32 },
                ].map((row) => (
                  <tr key={row.size} className="border-b border-zinc-700/70">
                    <td className="py-2.5 pr-4 font-medium">{row.size}</td>
                    <td className="py-2.5 pr-4">{row.chest} in</td>
                    <td className="py-2.5">{row.height} in</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            All size measurements are in inch.
          </p>
        </section>

        {/* Who has which jury number */}
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-zinc-100 sm:text-2xl">
            Who has which jurcy number
          </h2>
          <p className="mb-6 text-zinc-400">
            All members can see who took which jurcy number and their size. Data comes from the form submissions.
          </p>
          <JuryList />
        </section>

        <footer className="mt-16 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          HOT GANG — Jury assignment tracker
        </footer>
      </div>
    </div>
  );
}
