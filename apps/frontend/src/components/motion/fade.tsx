"use client";

import { type MotionProps, motion } from "motion/react";

type FadeProps = {
    children: React.ReactNode;
    initial?: MotionProps["initial"];
    animate?: MotionProps["animate"];
    exit?: MotionProps["exit"];
    transition?: MotionProps["transition"];
};

export function Fade({
    children,
    initial = { scale: 0.9, opacity: 0 },
    animate = { scale: 1, opacity: 1 },
    exit,
    transition = { duration: 0.6 },
    ...rest
}: FadeProps) {
    return (
        <motion.div
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            {...rest}
        >
            {children}
        </motion.div>
    );
}
