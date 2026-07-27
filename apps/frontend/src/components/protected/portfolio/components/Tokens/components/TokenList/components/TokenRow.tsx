type TokenRowProps = {
    label: string;
    children: React.ReactNode;
};

export default function TokenRow({ label, children }: TokenRowProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-zinc-400">{label}</span>
            <span className="font-medium text-white">{children}</span>
        </div>
    );
}
