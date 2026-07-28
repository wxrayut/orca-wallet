"use client";

import { IconArrowRight, IconDownload, IconWallet } from "@tabler/icons-react";

import { OrcaIcon } from "~/components/OrcaIcon";
import { SectionLayout } from "~/components/layouts";
import { Fade } from "~/components/motion";
import { ButtonLink, SpanLink } from "~/components/primitives";

import { useResponsive } from "~/hooks/system/client";

export function Hero() {
    const { isDesktop } = useResponsive();

    return (
        <SectionLayout>
            <Fade
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
            >
                <div className="flex flex-col items-center gap-8">
                    <OrcaIcon
                        size={isDesktop ? 300 : 200}
                        className="animate-bounce-slow transition-transform duration-300 hover:scale-105"
                    />

                    <div className="space-y-6 text-center">
                        <h1 className="mx-auto max-w-5xl text-3xl leading-[0.95] font-black tracking-tight md:text-7xl lg:text-8xl">
                            Own Your <span className="text-gradient">Ethereum</span>
                            .
                            <br />
                            Own Your Keys.
                        </h1>

                        <p className="mx-auto max-w-3xl text-lg leading-8 text-neutral-500 md:text-xl dark:text-neutral-400">
                            Built for{" "}
                            <SpanLink href="https://ethereum.org/en/">
                                Ethereum
                            </SpanLink>
                            . Manage assets and interact with smart contracts while
                            keeping full control of your private keys with{" "}
                            <SpanLink href="/docs">Orca Wallet</SpanLink>.
                        </p>
                    </div>
                </div>
            </Fade>

            <Fade
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <ButtonLink
                        href="/auth/sign-up"
                        className="h-12 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 text-sm font-semibold text-white"
                        useNextLink
                    >
                        <IconWallet className="mr-2 h-4 w-4" />
                        Create Wallet
                        <IconArrowRight className="mr-2 h-4 w-4" />
                    </ButtonLink>

                    <ButtonLink
                        href="/auth/sign-in"
                        className="h-12 rounded-xl px-8 text-sm font-semibold"
                        useNextLink
                    >
                        <IconDownload className="mr-2 h-4 w-4" />
                        Import Wallet
                    </ButtonLink>
                </div>
            </Fade>
        </SectionLayout>
    );
}
