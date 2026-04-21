import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,236,214,0.48),_transparent_68%)]"
      />

      <section className="relative flex w-full max-w-5xl flex-col items-center gap-12 text-center">
        <div className="space-y-5">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-[#7d081e]/70 sm:text-base">
            Quiz Battles Powered By AI
          </p>
          <h1 className="font-[family:var(--font-display)] text-[clamp(3.2rem,8vw,6.6rem)] leading-[0.95] tracking-[0.02em] text-[#b10f2e] drop-shadow-[0_6px_0_rgba(87,0,0,0.12)]">
            AI Trivia
            <span className="block text-[#8d0f26]">Showdown</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-[#5c0a14]/78 sm:text-xl">
            Jump into fast trivia matches, build your own quiz sets, and browse
            challenges you can turn into games later.
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
          <Link
            href="/search-quizzes"
            className="group relative inline-flex min-h-24 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-[#7f061d] bg-[#b10f2e] px-8 text-center shadow-[0_16px_0_0_#570000,0_28px_50px_-18px_rgba(87,0,0,0.6)] transition duration-200 ease-out hover:-translate-y-1 hover:bg-[#ca1a3a] hover:shadow-[0_20px_0_0_#570000,0_34px_56px_-18px_rgba(87,0,0,0.72)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#de7c5a] active:translate-y-3 active:bg-[#8f0820] active:shadow-[0_8px_0_0_#570000,0_16px_30px_-16px_rgba(87,0,0,0.58)]"
          >
            <span className="absolute inset-x-5 top-2 h-5 rounded-full bg-white/20 blur-md transition duration-200 group-hover:bg-white/30" />
            <span className="font-[family:var(--font-display)] text-4xl tracking-[0.08em] text-[#280000] sm:text-5xl">
              Play
            </span>
          </Link>

          <Link
            href="/create-quiz"
            className="rounded-[1.6rem] border-4 border-[#7f061d]/85 bg-[#f7d9bd] px-6 py-4 text-2xl font-bold text-[#7f061d] shadow-[0_10px_0_0_rgba(87,0,0,0.22)] transition duration-200 hover:-translate-y-1 hover:bg-[#ffe7d3] hover:shadow-[0_14px_0_0_rgba(87,0,0,0.26)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#de7c5a] active:translate-y-2 active:shadow-[0_5px_0_0_rgba(87,0,0,0.22)]"
          >
            Create Quiz
          </Link>

          <Link
            href="/search-quizzes"
            className="rounded-[1.6rem] border-4 border-[#7f061d]/85 bg-[#f7d9bd] px-6 py-4 text-2xl font-bold text-[#7f061d] shadow-[0_10px_0_0_rgba(87,0,0,0.22)] transition duration-200 hover:-translate-y-1 hover:bg-[#ffe7d3] hover:shadow-[0_14px_0_0_rgba(87,0,0,0.26)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] focus-visible:ring-offset-4 focus-visible:ring-offset-[#de7c5a] active:translate-y-2 active:shadow-[0_5px_0_0_rgba(87,0,0,0.22)]"
          >
            Search Quizzes
          </Link>
        </div>
      </section>
    </main>
  );
}
