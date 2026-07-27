export function CenterLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-screen-2xl">{children}</div>
        </main>
    );
}
