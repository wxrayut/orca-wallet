"use client";

import { useTheme } from "next-themes";

import { SectionLayout } from "~/components/layouts";
import { SectionTitle, SubsectionTitle } from "~/components/primitives";

import { useFont } from "~/hooks/system/client";

import FontSelect from "./components/FontSelect";
import ThemeSelect from "./components/ThemeSelect";

export default function Appearance() {
    const { theme, setTheme } = useTheme();
    const { font, setFont } = useFont();

    return (
        <SectionLayout reset>
            <SectionTitle
                title="Appearance"
                description="Customize the appearance of the app. Automatically switch between day and night themes."
                separated
            />

            <div className="flex flex-col gap-4">
                <SubsectionTitle
                    title="Font"
                    description="Choose your preferred font for the app."
                    separated={false}
                />

                <FontSelect
                    fonts={fonts}
                    selectedFont={font}
                    onFontChange={setFont}
                />

                <SubsectionTitle
                    title="Theme"
                    description="Choose your preferred theme for the app."
                    separated={false}
                />

                <ThemeSelect
                    themes={themes}
                    selectedTheme={theme}
                    onThemeChange={setTheme}
                />
            </div>
        </SectionLayout>
    );
}

const fonts = [
    {
        label: "Inter",
        value: "inter",
    },
    {
        label: "Manrope",
        value: "manrope",
    },
    {
        label: "Geist",
        value: "geist",
    },
    {
        label: "Geist Mono",
        value: "geist-mono",
    },
    {
        label: "Poppins",
        value: "poppins",
    },
    {
        label: "Space Grotesk",
        value: "space",
    },
    {
        label: "DM Sans",
        value: "dm",
    },
    {
        label: "Outfit",
        value: "outfit",
    },
    {
        label: "Rubik",
        value: "rubik",
    },
    {
        label: "IBM Plex Sans",
        value: "ibm",
    },
    {
        label: "Plus Jakarta Sans",
        value: "jakarta",
    },
    {
        label: "JetBrains Mono",
        value: "mono",
    },
    {
        label: "Fira Code",
        value: "fira",
    },
    {
        label: "Source Code Pro",
        value: "source",
    },
];

const themes = [
    {
        label: "Light",
        value: "light",
    },
    {
        label: "Dark",
        value: "dark",
    },
    {
        label: "System",
        value: "system",
    },
];
