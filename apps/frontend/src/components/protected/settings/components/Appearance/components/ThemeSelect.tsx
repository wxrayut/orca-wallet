import { Skeleton } from "~/components/ui/skeleton";

import { cn } from "~/lib/utils";

type ThemeSelectProps = {
    themes: {
        label: string;
        value: string;
    }[];
    selectedTheme: string | undefined;
    onThemeChange: (value: string) => void;
};

export default function ThemeSelect({
    themes,
    selectedTheme,
    onThemeChange,
}: ThemeSelectProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {themes.map((t) => {
                const active = selectedTheme === t.value;

                return (
                    <button
                        key={t.value}
                        onClick={() => onThemeChange(t.value)}
                        className={cn(
                            "group relative rounded-md border p-4 text-left transition-all",
                            "bg-muted/40 hover:bg-accent",
                            "backdrop-blur",
                            active &&
                                "border-primary ring-primary/40 shadow-lg ring-2",
                        )}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm">{t.label}</span>

                            {active && (
                                <div className="bg-primary h-2 w-2 rounded-full" />
                            )}
                        </div>

                        <div
                            className={cn(
                                "overflow-hidden rounded-xl border",
                                t.value === "dark" &&
                                    "border-slate-800 bg-slate-950",
                                t.value === "light" &&
                                    "border-gray-200 bg-white",
                                t.value === "system" &&
                                    "border-gray-200 bg-white",
                            )}
                        >
                            <div className="space-y-2 p-3">
                                <Skeleton className="h-4 w-2/3 rounded" />
                                <Skeleton className="h-4 w-1/2 rounded" />

                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-2 w-2/3 rounded" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-2 w-1/2 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
