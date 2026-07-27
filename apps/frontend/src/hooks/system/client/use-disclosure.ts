"use client";

import * as React from "react";

export function useDisclosure(initial: boolean) {
    const [isOpen, setOpen] = React.useState(initial);

    const onOpen = React.useCallback(() => setOpen(true), []);
    const onClose = React.useCallback(() => setOpen(false), []);
    const onToggle = React.useCallback(() => setOpen((v) => !v), []);

    return { isOpen, setOpen, onOpen, onClose, onToggle };
}
