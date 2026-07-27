type ActivityRowProps = {
    label: string;
    children: React.ReactNode;
};

export default function ActivityRow({ label, children }: ActivityRowProps) {
    return (
        <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs md:text-sm">{label}</span>

            <div className="flex items-center gap-2 text-xs md:text-sm">
                {children}
            </div>
        </div>
    );
}
