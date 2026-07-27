import { motion } from "motion/react";

type Direction = "left" | "right" | "up" | "down";

type SlideProps = {
    children: React.ReactNode;
    direction?: Direction;
    distance?: number;
    duration?: number;
};

function getInitialPosition(
    direction: Direction | undefined,
    distance: number | undefined,
) {
    const dist = distance ?? 100;

    switch (direction) {
        case "left":
            return { x: -dist, opacity: 0 };
        case "right":
            return { x: dist, opacity: 0 };
        case "up":
            return { y: -dist, opacity: 0 };
        case "down":
            return { y: dist, opacity: 0 };
        default:
            return { opacity: 0 };
    }
}

export function Slide({ children, direction, distance, duration }: SlideProps) {
    return (
        <motion.div
            initial={getInitialPosition(direction, distance)}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: duration ?? 0.5 }}
        >
            {children}
        </motion.div>
    );
}
