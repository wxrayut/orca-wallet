"use client";

import { IconDownload, IconWallet } from "@tabler/icons-react";

import { OrcaIcon } from "~/components/OrcaIcon";
import { SectionLayout } from "~/components/layouts";
import { Fade } from "~/components/motion";
import { ButtonLink, SpanLink } from "~/components/primitives";

import { useResponsive } from "~/hooks/system/client";

export function Hero() {
    const { isDesktop } = useResponsive();

    return (
        <SectionLayout>
            <div></div>
            {/* <Fade
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
            >
                <div className="flex flex-col items-center justify-center gap-4">
                    <OrcaIcon
                        size={isDesktop ? 200 : 100}
                        className="animate-bounce-slow transition-transform duration-300 hover:scale-105"
                    />

                    <h2 className="text-gradient heading-hero relative mb-4 text-center">
                        Gateway to Seamless Crypto Management
                    </h2>
                </div>
            </Fade>

            <Fade
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                <div className="flex items-center justify-center">
                    <h3 className="mb-4 w-full max-w-4xl text-center text-sm leading-normal text-neutral-500 md:text-xl dark:text-neutral-400">
                        Built for{" "}
                        <SpanLink href="https://ethereum.org/en/">Ethereum</SpanLink>
                        . Manage assets and interact with smart contracts while
                        keeping full control of your private keys with{" "}
                        <SpanLink href="/docs">Orca Wallet</SpanLink>.
                    </h3>
                </div>
            </Fade> */}
            {/* 
            <Fade
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex items-center justify-center gap-4">
                    <ButtonLink href="/auth/sign-in" className="font-mono text-xs">
                        <IconDownload className="mr-2 h-2 w-2" />
                        Import Wallet
                    </ButtonLink>

                    <ButtonLink
                        href="/auth/sign-up"
                        className="bg-linear-to-r from-blue-600 to-indigo-600 font-mono text-xs text-white hover:bg-blue-700"
                    >
                        <IconWallet className="mr-2 h-2 w-2" />
                        Create Wallet
                    </ButtonLink>
                </div>
            </Fade> */}
        </SectionLayout>
    );
}
