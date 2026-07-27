import { cn } from "~/lib/utils";

type ActionTriggerProps = {
    icon?: React.ReactNode;
    label: string;
    className?: string;
};

export function ActionTrigger({ icon, label, className = "" }: ActionTriggerProps) {
    return (
        <div
            className={cn(
                "flex w-auto items-center justify-between gap-2",
                className,
            )}
        >
            {icon}
            <span className="w-full text-center">{label}</span>
        </div>
    );
}
