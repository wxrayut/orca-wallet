export function RadialNoise() {
    return (
        <div className="absolute -top-2 left-0 -z-999 h-150 w-full">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px] opacity-4 mix-blend-overlay" />
        </div>
    );
}
