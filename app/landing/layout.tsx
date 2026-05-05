import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./landing.module.css";
import { landingNav } from "./landing-content";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pageShell}>
      <div className={styles.backdropGlow} aria-hidden="true" />

      <header className={styles.topBar}>
        <div>
          <Link href="/landing" className={styles.brand}>
            AI Trivia Showdown
          </Link>
          <p className={styles.navSubhead}>Product Launch Mini-Site</p>
        </div>

        <nav className={styles.topNav} aria-label="Landing site pages">
          {landingNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {children}

      <footer className={styles.footerBar}>
        <p>Built for a product launch assignment in AI-Assisted Programming.</p>
        <div className={styles.footerLinks}>
          <Link href="/play">Play Game</Link>
          <Link href="/create-quiz">Create Quiz</Link>
          <Link href="/">Main App</Link>
        </div>
      </footer>
    </div>
  );
}
