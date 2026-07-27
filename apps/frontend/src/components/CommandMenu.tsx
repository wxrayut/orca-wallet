import { IconSettings, IconUser } from "@tabler/icons-react";

import { useSearch } from "~/hooks/system/client";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "./ui/command";

export function CommandMenu() {
    const { isOpen, setOpen } = useSearch();

    return (
        <CommandDialog open={isOpen} onOpenChange={setOpen}>
            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Settings">
                        <CommandItem>
                            <IconUser className="mr-2" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <IconSettings className="mr-2" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    );
}
