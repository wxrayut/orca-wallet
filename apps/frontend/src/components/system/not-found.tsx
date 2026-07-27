"use client";

import { usePathname } from "next/navigation";

import { CenterLayout, SectionLayout } from "~/components/layouts";
import { Fade } from "~/components/motion";

import { OrcaIcon } from "../OrcaIcon";
import { RadialGlow } from "../decorative";
import { ButtonLink } from "../primitives";

export function NotFound() {
    const pathname = usePathname();

    return (
        <CenterLayout>
            <RadialGlow />
            <SectionLayout>
                <Fade>
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="mb-4 flex w-full items-center justify-center">
                            <OrcaIcon size={100} animated />
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            Lost at Sea
                        </h1>

                        <p className="text-muted-foreground mt-2 text-sm break-all">
                            No route found for{" "}
                            <span className="text-red-400 underline">
                                {pathname}
                            </span>
                        </p>

                        <p className="text-muted-foreground mt-2 text-sm">
                            This page doesn&apos;t exist on the Orca Wallet.
                            <br />
                            The ocean is deep — but this route goes nowhere.
                        </p>

                        <div className="mt-2 space-x-4">
                            <ButtonLink
                                href="/"
                                className="rounded-lg p-4"
                                useNextLink={true}
                            >
                                Take me Home
                            </ButtonLink>

                            <ButtonLink
                                href="/portfolio"
                                variant="outline"
                                className="button-gradient rounded-lg p-4"
                                useNextLink={true}
                            >
                                Back to Wallet
                            </ButtonLink>
                        </div>
                    </div>
                </Fade>
            </SectionLayout>
        </CenterLayout>
    );
}
