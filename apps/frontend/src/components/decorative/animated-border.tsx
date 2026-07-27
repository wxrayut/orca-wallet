import { cn } from "~/lib/utils";

const borderColors = {
    blue: "[background:linear-gradient(45deg,var(--color-card),var(--color-muted))_padding-box,conic-gradient(from_var(--border-angle),rgba(59,130,246,0.15)_80%,#3b82f6_86%,#6366f1_90%,#3b82f6_94%,rgba(59,130,246,0.15))_border-box]",
    purple: "[background:linear-gradient(45deg,var(--color-card),var(--color-muted))_padding-box,conic-gradient(from_var(--border-angle),rgba(139,92,246,0.15)_80%,#8b5cf6_86%,#a78bfa_90%,#8b5cf6_94%,rgba(139,92,246,0.15))_border-box]",
    green: "[background:linear-gradient(45deg,var(--color-card),var(--color-muted))_padding-box,conic-gradient(from_var(--border-angle),rgba(34,197,94,0.15)_80%,#22c55e_86%,#4ade80_90%,#22c55e_94%,rgba(34,197,94,0.15))_border-box]",
    red: "[background:linear-gradient(45deg,var(--color-card),var(--color-muted))_padding-box,conic-gradient(from_var(--border-angle),rgba(239,68,68,0.15)_80%,#ef4444_86%,#f87171_90%,#ef4444_94%,rgba(239,68,68,0.15))_border-box]",
} as const;

type BorderColor = keyof typeof borderColors;

type AnimatedBorderProps = {
    children: React.ReactNode;
    className?: string;
    color?: BorderColor;
};

export function AnimatedBorder({
    children,
    className,
    color = "blue",
}: AnimatedBorderProps) {
    return (
        <div
            className={cn(
                "animate-border h-fit rounded-lg border border-transparent",
                borderColors[color],
                className,
            )}
        >
            {children}
        </div>
    );
}
