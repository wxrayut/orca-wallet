import { Button } from "~/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

import { useResponsive } from "~/hooks/system/client";

import { cn } from "~/lib/utils";

type TabsSelectProps = {
    tabs: {
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        value: string;
    }[];
    selectedTab: string;
    onTabChange?: (value: string) => void;
};

export default function TabsSelect({
    tabs,
    selectedTab,
    onTabChange,
}: TabsSelectProps) {
    const { isDesktop } = useResponsive();

    return isDesktop ? (
        <div className="flex flex-col gap-2 rounded-md bg-transparent">
            {tabs.map((tab) => {
                const active = selectedTab === tab.value;

                return (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange?.(tab.value)}
                        className={cn(
                            "nav-link-mobile w-full cursor-pointer rounded-md text-left text-sm font-medium",
                            active && "nav-link-mobile-active",
                        )}
                    >
                        {active && <span className="nav-link-indicator" />}
                        <tab.icon className="mr-2 h-4 w-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    ) : (
        <Select value={selectedTab} onValueChange={onTabChange}>
            <SelectTrigger className="w-full cursor-pointer rounded-md">
                <SelectValue />
            </SelectTrigger>

            <SelectContent position="popper" className="mt-2 rounded-md">
                {tabs.map((tab) => (
                    <SelectItem
                        key={tab.value}
                        value={tab.value}
                        className="cursor-pointer"
                    >
                        <tab.icon />
                        {tab.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
