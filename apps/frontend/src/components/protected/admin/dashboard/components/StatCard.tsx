import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { cn } from "~/lib/utils";

type StatCardProps = {
    icon: React.ComponentType<{ className?: string; size?: number }>;
    title: string;
    value: number;
    trend?: number;
    iconColor?: string;
};

const iconColors: Record<string, string> = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
};

const iconBgColors: Record<string, string> = {
    blue: "bg-blue-500/10",
    green: "bg-green-500/10",
    red: "bg-red-500/10",
    yellow: "bg-yellow-500/10",
    purple: "bg-purple-500/10",
};

export default function StatCard({
    icon: Icon,
    title,
    value,
    trend,
    iconColor = "blue",
}: StatCardProps) {
    const isPositiveTrend = trend !== undefined && trend > 0;
    const isNegativeTrend = trend !== undefined && trend < 0;

    return (
        <Card className="rounded-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-extralight">
                        {title}
                    </CardTitle>

                    <div
                        className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            iconBgColors[iconColor],
                        )}
                    >
                        <Icon
                            className={iconColors[iconColor] || iconColors.blue}
                            size={18}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    <div className="text-2xl font-bold tracking-tight">
                        {value.toLocaleString()}
                    </div>

                    {trend !== undefined && (
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                                    isPositiveTrend &&
                                        "bg-green-500/10 text-green-600 dark:text-green-400",
                                    isNegativeTrend &&
                                        "bg-red-500/10 text-red-600 dark:text-red-400",
                                    trend === 0 && "bg-muted text-muted-foreground",
                                )}
                            >
                                {isPositiveTrend && <IconTrendingUp size={14} />}
                                {isNegativeTrend && <IconTrendingDown size={14} />}
                                {isPositiveTrend && "+"}
                                {trend}%
                            </div>

                            <span className="text-muted-foreground text-xs">
                                vs yesterday
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
