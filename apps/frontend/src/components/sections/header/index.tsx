import { cn } from "~/lib/utils";

type HeaderProps = {
    className?: string;
    innerClassName?: string;
    children?: React.ReactNode;
};

export function Header({ className, innerClassName, children }: HeaderProps) {
    return (
        <header
            className={cn(
                "bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur",
                className,
            )}
        >
            <div
                className={cn(
                    "container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6 2xl:px-0",
                    innerClassName,
                )}
            >
                {children}
            </div>
        </header>
    );
}

{
    /* {!initializing &&
        (user ? (
            <>
                <div className="flex w-full items-center justify-between">
                    <div>asdasd</div>

                    <div>
                        <UserProfile />
                    </div>
                </div>
            </>
        ) : (
            <> </>
        ))} */
}
