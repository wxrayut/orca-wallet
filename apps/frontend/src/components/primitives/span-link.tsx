import { cn } from "~/lib/utils";

interface SpanLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function SpanLink({ href, children, className, ...props }: SpanLinkProps) {
    return (
        <span
            className={cn(
                "relative inline-block rounded-lg px-0.5 transition-colors duration-150 hover:bg-violet-500/7.5",
                className,
            )}
            {...props}
        >
            <a
                href={href}
                target="_blank"
                className="text-gradient relative z-10 font-mono font-semibold"
            >
                {children}
            </a>
        </span>
    );
}
