import * as React from "react";

import { cn } from "~/lib/utils";

export function FloatingInput({
    label,
    className,
    error,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: boolean;
}) {
    return (
        <div className="relative">
            <input
                placeholder=" "
                className={cn(
                    `peer border-border w-full rounded-md border bg-transparent px-4 pt-2 pb-2 text-sm transition-all duration-200 outline-none focus:border-blue-500`,
                    error &&
                        "border-destructive focus:border-destructive focus:ring-destructive/30",
                    className,
                )}
                {...props}
            />

            <label
                className={cn(
                    `peer-focus:bg-background peer-not-placeholder-shown:bg-background text-muted-foreground pointer-events-none absolute top-1/2 left-4 z-10 origin-left -translate-y-1/2 rounded-sm px-2 text-xs transition-all duration-200 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75 md:text-sm`,
                )}
            >
                {label}
            </label>
        </div>
    );
}

export const FloatingInputRef = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        label: string;
        error?: boolean;
    }
>(({ label, className, error, ...props }, ref) => {
    return (
        <div className="relative">
            <input
                ref={ref}
                placeholder=" "
                className={cn(
                    `peer border-border w-full rounded-md border bg-transparent px-4 pt-2 pb-2 text-sm transition-all duration-200 outline-none focus:border-blue-500`,
                    error &&
                        "border-destructive focus:border-destructive focus:ring-destructive/30",
                    className,
                )}
                {...props}
            />

            <label
                className={cn(
                    `peer-focus:bg-background peer-not-placeholder-shown:bg-background text-muted-foreground pointer-events-none absolute top-1/2 left-4 z-10 origin-left -translate-y-1/2 rounded-sm px-2 text-sm transition-all duration-200 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:scale-75 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-75`,
                )}
            >
                {label}
            </label>
        </div>
    );
});
