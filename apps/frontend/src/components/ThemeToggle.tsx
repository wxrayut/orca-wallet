import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { IconMoon, IconSunWind } from "@tabler/icons-react";

import { Button } from "./ui/button";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme === "light" ? <IconMoon size={18} /> : <IconSunWind size={18} />}
        </Button>
    );
}
