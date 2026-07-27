import NextLink from "next/link";

import { cn } from "~/lib/utils";

import { Button } from "../ui/button";

type ButtonLink = React.ComponentProps<typeof Button>;

interface ButtonLinkProps extends ButtonLink {
    href: string;
    target?: string;
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    useNextLink?: boolean;
}

export function ButtonLink({
    href,
    target,
    children,
    className,
    variant = "default",
    size = "default",
    useNextLink = false,
    ...props
}: ButtonLinkProps) {
    return (
        <Button
            asChild
            variant={variant}
            size={size}
            className={cn(className)}
            {...props}
        >
            {useNextLink ? (
                <NextLink href={href} target={target}>
                    {children}
                </NextLink>
            ) : (
                <a href={href} target={target}>
                    {children}
                </a>
            )}
        </Button>
    );
}
