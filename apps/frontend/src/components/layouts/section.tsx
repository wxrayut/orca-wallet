import { cn } from "~/lib/utils";

export function SectionLayout({
    children,
    className,
    innerClassName,
    reset = false,
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    innerClassName?: string;
    reset?: boolean;
}>) {
    return (
        <section
            className={cn(reset ? "p-0" : "px-6 py-16 md:py-24", className)}
        >
            <div
                className={cn(
                    "mx-auto w-full max-w-screen-2xl",
                    innerClassName,
                )}
            >
                {children}
            </div>
        </section>
    );
}
