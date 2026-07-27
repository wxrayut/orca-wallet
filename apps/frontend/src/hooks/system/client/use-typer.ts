"use client";

import * as React from "react";

import { stagger, useAnimate, useInView } from "framer-motion";

interface UseTypewriterOptions {
    staggerDelay?: number;
    duration?: number;
    onComplete?: () => void;
    once?: boolean;
}

export function useTypewriter({
    staggerDelay = 0.04,
    duration = 0.2,
    onComplete,
    once = true,
}: UseTypewriterOptions = {}) {
    const [scope, animate] = useAnimate();
    const completedRef = React.useRef(false);

    const inView = useInView(scope, { once });

    React.useEffect(() => {
        if (!inView) return;
        if (completedRef.current) return;

        const chars = scope.current?.querySelectorAll("[data-char]");

        if (!chars || chars.length === 0) return;

        completedRef.current = true;

        animate(
            chars,
            {
                opacity: 1,
                display: "inline-block",
            },
            {
                delay: stagger(staggerDelay),
                duration,
                ease: "easeOut",
            },
        ).then(() => {
            onComplete?.();
        });
    }, [inView, animate, staggerDelay, duration, onComplete]);

    return {
        scope,
    };
}
