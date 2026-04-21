import Link from "next/link";

export default function SelectGamePage() {
    const games = [
        {
            id: "classic",
            name: "Classic Quiz",
            description: "Test your knowledge with our classic trivia format."
        }
    ];

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,236,214,0.48),_transparent_68%)]"
            />

            <section className="relative flex w-full max-w-4xl flex-col items-center gap-12">
                <div className="space-y-3 text-center">
                    <h1 className="font-[family:var(--font-display)] text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-[0.02em] text-[#b10f2e] drop-shadow-[0_6px_0_rgba(87,0,0,0.12)]">
                        Choose a Game
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-[#5c0a14]/78 sm:text-xl">
                        Select how you want to play and challenge yourself with trivia questions
                    </p>
                </div>

                <div className="grid w-full gap-6 sm:grid-cols-2">
                    {games.map((game) => (
                        <Link
                            key={game.id}
                            href={`/play?type=${game.id}`}
                            className="group flex flex-col gap-4 rounded-2xl border-4 border-[#7f061d] bg-gradient-to-br from-[#b10f2e] to-[#8f0820] p-6 shadow-[0_16px_0_0_#570000,0_28px_50px_-18px_rgba(87,0,0,0.6)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_0_0_#570000,0_34px_56px_-18px_rgba(87,0,0,0.72)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe5c9] sm:p-8"
                        >
                            <div>
                                <h2 className="font-[family:var(--font-display)] text-3xl tracking-[0.08em] text-[#280000] transition group-hover:text-white sm:text-4xl">
                                    {game.name}
                                </h2>
                            </div>
                            <p className="text-sm leading-relaxed text-[#ffe7d5]/90 sm:text-base">
                                {game.description}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ffe7d5]/70">
                                    Play Now
                                </span>
                                <span className="text-xl">→</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link
                    href="/"
                    className="text-center font-bold text-[#b10f2e] underline transition hover:text-[#8f0820]"
                >
                    ← Back to Home
                </Link>
            </section>
        </main>
    );
}
