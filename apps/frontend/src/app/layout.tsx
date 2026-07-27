import type { Metadata } from "next";
import {
    DM_Sans,
    Fira_Code,
    Geist,
    Geist_Mono,
    IBM_Plex_Sans,
    Inter,
    JetBrains_Mono,
    Manrope,
    Outfit,
    Plus_Jakarta_Sans,
    Poppins,
    Rubik,
    Source_Code_Pro,
    Space_Grotesk,
} from "next/font/google";

import { siteConfig } from "~/site-config";

import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";

import { AdminProvider, AuthProvider, WalletProvider } from "~/contexts";
import {
    FontProvider,
    ResponsiveProvider,
    SearchProvider,
    ThemeProvider,
} from "~/contexts/system";

import { cn } from "~/lib/utils";

import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const manrope = Manrope({
    variable: "--font-sans",
    subsets: ["latin"],
});

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "600"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space",
    subsets: ["latin"],
});

const dmSans = DM_Sans({
    variable: "--font-dm",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

const rubik = Rubik({
    variable: "--font-rubik",
    subsets: ["latin"],
});

const ibm = IBM_Plex_Sans({
    variable: "--font-ibm",
    subsets: ["latin"],
});

const fira = Fira_Code({
    variable: "--font-fira",
    subsets: ["latin"],
});

const sourceCode = Source_Code_Pro({
    variable: "--font-source",
    subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
    variable: "--font-jakarta",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: `${siteConfig.siteName} - ${siteConfig.description}`,
        template: `${siteConfig.siteName} | %s`,
    },
    description: siteConfig.description,
    authors: [{ name: "wxrayut", url: "https://github.com/wxrayut" }],
    openGraph: {
        title: siteConfig.siteName,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.siteName,
        locale: "en-US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.siteName,
        description: siteConfig.description,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "h-full antialiased",
                inter.variable,
                manrope.variable,
                geist.variable,
                geistMono.variable,
                jetbrains.variable,
                poppins.variable,
                spaceGrotesk.variable,
                dmSans.variable,
                outfit.variable,
                rubik.variable,
                ibm.variable,
                fira.variable,
                sourceCode.variable,
                jakarta.variable,
            )}
        >
            <body className="flex min-h-full flex-col">
                <AuthProvider>
                    <WalletProvider>
                        <AdminProvider>
                            <FontProvider>
                                <ResponsiveProvider>
                                    <SearchProvider>
                                        <ThemeProvider>
                                            <TooltipProvider>
                                                {children}
                                            </TooltipProvider>
                                        </ThemeProvider>
                                    </SearchProvider>
                                </ResponsiveProvider>
                            </FontProvider>
                        </AdminProvider>
                    </WalletProvider>
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
