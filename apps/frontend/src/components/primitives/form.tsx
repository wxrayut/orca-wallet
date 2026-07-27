import { cn } from "~/lib/utils";

export function Form({ className, ...props }: React.ComponentProps<"form">) {
    return (
        <form
            className={cn(
                `border-border/50 bg-background/70 w-full rounded-xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-200`,
                className,
            )}
            {...props}
        />
    );
}
