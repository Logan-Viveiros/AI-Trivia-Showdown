"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function BackgroundMusic() {
    const backgroundAudioRef = useRef<HTMLAudioElement>(null);
    const quizAudioRef = useRef<HTMLAudioElement>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Check if user is actively playing a game
        const isPlayingGame = pathname === "/play" && searchParams.get("quiz");

        if (isPlayingGame) {
            // Pause background music, play quiz music
            backgroundAudioRef.current?.pause();
            quizAudioRef.current?.play().catch(() => {
                // Silently fail if autoplay is blocked
            });
        } else {
            // Pause quiz music, play background music
            quizAudioRef.current?.pause();
            backgroundAudioRef.current?.play().catch(() => {
                // Silently fail if autoplay is blocked
            });
        }
    }, [pathname, searchParams]);

    return (
        <>
            <audio
                ref={backgroundAudioRef}
                src="/audio/Background Ambience.mp3"
                loop
                onCanPlay={() => {
                    if (backgroundAudioRef.current) {
                        backgroundAudioRef.current.volume = 0.3;
                    }
                }}
            />
            <audio
                ref={quizAudioRef}
                src="/audio/Quiz Loop.mp3"
                loop
                onCanPlay={() => {
                    if (quizAudioRef.current) {
                        quizAudioRef.current.volume = 0.3;
                    }
                }}
            />
        </>
    );
}
