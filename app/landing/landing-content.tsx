import Link from "next/link";
import styles from "./landing.module.css";

export const landingNav = [
  { href: "/landing", label: "Landing" },
  { href: "/landing/teaser", label: "Teaser Demo" },
  { href: "/landing/about", label: "About / Info" },
  { href: "/landing/developer", label: "Developer" },
  { href: "/landing/reviews", label: "AI Reviews" },
];

export const launchPages = [
  {
    href: "/landing/teaser",
    title: "Teaser Demo",
    description:
      "A trailer-style page that maps out the strongest 2-minute walkthrough of the game.",
  },
  {
    href: "/landing/about",
    title: "About / Info",
    description:
      "A clear explanation of what AI Trivia Showdown is, how it works, and why people would care.",
  },
  {
    href: "/landing/developer",
    title: "About the Developer",
    description:
      "A portfolio-style page about the builder, the goals behind the project, and the skills learned.",
  },
  {
    href: "/landing/reviews",
    title: "AI-Generated Reviews",
    description:
      "Published-style reactions from multiple professional perspectives, written as if the project has already launched.",
  },
];

export const teaserBeats = [
  {
    step: "01",
    title: "Start with the energy",
    body: "Open on the bright home screen so the quiz-show identity is obvious in the first few seconds.",
  },
  {
    step: "02",
    title: "Show a round in motion",
    body: "Let viewers see a question appear, answers land, and the pace stay quick enough to feel playful.",
  },
  {
    step: "03",
    title: "Reveal the builder",
    body: "End by showing how a player can make a custom quiz, which hints at the project's long-term potential.",
  },
];

export const featureCards = [
  {
    title: "Arcade-style learning",
    body: "The game frames trivia like a face-off instead of a worksheet, which makes repeat play feel more natural.",
  },
  {
    title: "Fast custom content",
    body: "Quiz creation gives the project room to grow beyond one fixed topic or one teacher-made set.",
  },
  {
    title: "AI as a scale tool",
    body: "AI helps turn one polished experience into many future experiences by speeding up ideation and content generation.",
  },
];

export const aboutSections = [
  {
    title: "What it is",
    body: "AI Trivia Showdown is a quiz game built around fast rounds, bold presentation, and a custom quiz pipeline that keeps the project expandable.",
  },
  {
    title: "How you use it",
    body: "A player can jump into a round, pick from quiz options, answer questions quickly, and then return for another run or build a new quiz set.",
  },
  {
    title: "Why it matters",
    body: "This project explores how school-oriented tools feel stronger when they borrow pacing, style, and feedback loops from games people actually want to return to.",
  },
];

export const keyFeatures = [
  "Bright, readable game-show visual identity",
  "A play flow built around short sessions and replay value",
  "Custom quiz creation that makes the project flexible",
  "AI-assisted workflow for generating more content over time",
];

export const developerHighlights = [
  "Built this launch site as a real, deployed product instead of a slideshow or school report",
  "Blended gameplay-style interaction, clean UI, and AI-assisted tooling into a single project",
  "Turned academic review into something closer to a fast, competitive problem-solving session",
  "Used AI as a helper instead of a crutch: shaping prompts, rewriting output, and keeping the final code intentional",
  "Brought in experience from Minecraft modding, contest programming, and school projects to ship something polished as a high school developer",
];

export const skillTags = [
  "Next.js App Router",
  "React",
  "TypeScript",
  "Tailwind and custom CSS",
  "Firebase",
  "Prompt design",
  "Product presentation",
];

export const reviews = [
  {
    role: "Software Engineer",
    score: "8.3 / 10",
    headline: "A promising interactive product with a strong identity and smart extension points.",
    quote:
      "The best part of AI Trivia Showdown is that it already thinks beyond a one-off class demo. The custom quiz workflow creates a foundation for future expansion, and the game-like presentation gives the app a clearer personality than most student projects. My biggest recommendation would be deeper validation, smoother state handling, and a bit more production hardening, but the core idea is solid and the user-facing direction is very easy to understand.",
    verdict: "Strong concept, good extensibility, worth polishing further.",
  },
  {
    role: "Company Executive",
    score: "8.0 / 10",
    headline: "A classroom-friendly concept with obvious room for audience growth.",
    quote:
      "This project has a clear pitch: make learning feel more alive through game presentation and AI-assisted content expansion. That is easy to explain, easy to demo, and easy to imagine adapting for different classrooms or subjects. If I were evaluating it as an early product, I would want stronger onboarding and clearer retention hooks, but the core positioning is marketable because it turns a familiar tool into something with more energy.",
    verdict: "Easy to pitch, memorable, and more scalable than a fixed quiz app.",
  },
  {
    role: "Game Studio Perspective",
    score: "7.8 / 10",
    headline: "A playful educational game with a strong theme and good moment-to-moment clarity.",
    quote:
      "From a game design angle, the project's biggest strength is tone. The interface understands that excitement matters, even for trivia, and the pacing supports that choice. The next leap would be more dramatic feedback, progression layers, and difficulty tuning, but the current version already shows better thematic cohesion than many classroom games that stop at being merely functional.",
    verdict: "Needs more depth to become sticky, but the presentation choices are on the right track.",
  },
  {
    role: "Target Demographic",
    score: "8.7 / 10",
    headline: "It actually feels like a game instead of homework pretending to be fun.",
    quote:
      "What makes this project work for me is that it does not talk down to the player. The screens are bold, the idea is easy to get, and the quiz flow looks like something I would actually click on instead of just tolerating for a grade. I would want even more categories and maybe some versus-style moments, but I can already see this being useful for studying without feeling boring.",
    verdict: "Engaging, approachable, and much more inviting than a plain review app.",
  },
];

export function HeroArtwork() {
  return (
    <svg
      viewBox="0 0 620 620"
      className={styles.heroArtwork}
      role="img"
      aria-label="Stylized launch art for AI Trivia Showdown"
    >
      <defs>
        <radialGradient id="orb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7cf" />
          <stop offset="42%" stopColor="#ffc76a" />
          <stop offset="100%" stopColor="#ef5f31" />
        </radialGradient>
        <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a0a22" />
          <stop offset="100%" stopColor="#31020e" />
        </linearGradient>
        <linearGradient id="beamA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd778" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff7548" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="beamB" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe5a3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6d45" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <rect x="24" y="24" width="572" height="572" rx="46" fill="url(#panel)" />
      <circle cx="310" cy="176" r="112" fill="url(#orb)" opacity="0.96" />
      <path d="M86 484 L282 204 L340 204 L150 504 Z" fill="url(#beamA)" opacity="0.94" />
      <path d="M534 484 L338 204 L398 204 L470 504 Z" fill="url(#beamB)" opacity="0.94" />

      <g opacity="0.92">
        <rect x="100" y="344" width="156" height="100" rx="24" fill="#f8dbc0" />
        <rect x="364" y="328" width="156" height="100" rx="24" fill="#f8dbc0" />
        <circle cx="178" cy="394" r="24" fill="#b10f2e" />
        <circle cx="442" cy="378" r="24" fill="#b10f2e" />
        <rect x="146" y="382" width="64" height="24" rx="12" fill="#7f061d" />
        <rect x="410" y="366" width="64" height="24" rx="12" fill="#7f061d" />
      </g>

      <g fill="#ffe28d">
        <circle cx="152" cy="140" r="12" />
        <circle cx="468" cy="148" r="14" />
        <circle cx="128" cy="270" r="8" />
        <circle cx="500" cy="246" r="10" />
      </g>

      <g fill="#fff4da">
        <text x="308" y="314" textAnchor="middle" fontSize="40" fontWeight="800">
          QUIZ
        </text>
        <text x="308" y="356" textAnchor="middle" fontSize="40" fontWeight="800">
          SHOWDOWN
        </text>
      </g>

      <g fill="none" stroke="#fce8be" strokeWidth="14" strokeLinecap="round">
        <path d="M170 516 C248 468 372 468 450 516" />
        <path d="M228 550 C286 526 334 526 392 550" opacity="0.8" />
      </g>

      <g fill="#2f010d">
        <rect x="242" y="250" width="136" height="54" rx="18" opacity="0.88" />
        <text
          x="310"
          y="286"
          textAnchor="middle"
          fontSize="36"
          fontWeight="900"
          letterSpacing="3"
          fill="#ffe9c8"
        >
          AI
        </text>
      </g>
    </svg>
  );
}

export function SiteMapCards() {
  return (
    <div className={styles.pageGrid}>
      {launchPages.map((page) => (
        <article key={page.href} className={styles.pageCard}>
          <h3>{page.title}</h3>
          <p>{page.description}</p>
          <Link href={page.href} className={styles.inlineLink}>
            Open page
          </Link>
        </article>
      ))}
    </div>
  );
}
