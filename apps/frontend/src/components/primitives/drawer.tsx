import { MouseEventHandler } from "react";

import { Button } from "~/components/ui/button";
import {
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    Drawer as ShadCNDrawer,
} from "~/components/ui/drawer";
import { Spinner } from "~/components/ui/spinner";

import { cn } from "~/lib/utils";

type DrawerProps = {
    triggerVariant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    triggerClassName?: string;
    disableTrigger?: boolean;
    triggerContent: React.ReactNode;
    contentClassName?: string;
    headerTitle?: string;
    headerDescription?: string;
    children: React.ReactNode;
    disableFooter?: boolean;
    disableConfirm?: boolean;
    confirmTriggerVariant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    confirmTriggerClassName?: string;
    confirmTriggerContent?: React.ReactNode;
    disableCloser?: boolean;
    closerTriggerClassName?: string;
    closerTriggerContent?: React.ReactNode;
    onConfirm?: MouseEventHandler<HTMLButtonElement>;
    loading?: boolean;
};

export function Drawer({
    triggerVariant = "outline",
    triggerClassName,
    disableTrigger,
    triggerContent,
    contentClassName,
    headerTitle,
    headerDescription,
    children,
    disableFooter,
    disableConfirm,
    confirmTriggerVariant,
    confirmTriggerClassName,
    confirmTriggerContent,
    disableCloser,
    closerTriggerClassName,
    closerTriggerContent,
    onConfirm,
    loading,
}: DrawerProps) {
    return (
        <ShadCNDrawer>
            <DrawerTrigger asChild>
                <Button
                    variant={triggerVariant}
                    className={cn(
                        "flex cursor-pointer items-center gap-2",
                        triggerClassName,
                    )}
                    disabled={disableTrigger}
                >
                    {triggerContent}
                </Button>
            </DrawerTrigger>

            <DrawerContent
                className={cn("flex max-h-[80vh] flex-col", contentClassName)}
            >
                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                    <div className="mx-auto w-full max-w-md py-6">
                        <DrawerHeader className="px-0">
                            <DrawerTitle className="text-gradient text-lg">
                                {headerTitle || ""}
                            </DrawerTitle>

                            {headerDescription && (
                                <DrawerDescription className="text-xs">
                                    {headerDescription}
                                </DrawerDescription>
                            )}
                        </DrawerHeader>

                        <div className="mt-4">{children}</div>
                    </div>
                </div>

                {!disableFooter && (
                    <DrawerFooter className="w-full border-t">
                        <div className="mx-auto flex w-full max-w-md flex-col gap-4 py-2">
                            {!disableConfirm && (
                                <Button
                                    variant={confirmTriggerVariant}
                                    className={cn(
                                        "cursor-pointer rounded-md",
                                        confirmTriggerClassName,
                                    )}
                                    onClick={onConfirm}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner />
                                    ) : (
                                        confirmTriggerContent || "Confirm"
                                    )}
                                </Button>
                            )}

                            {!disableCloser && (
                                <DrawerClose asChild>
                                    <Button
                                        className={cn(
                                            "cursor-pointer rounded-md",
                                            closerTriggerClassName,
                                        )}
                                        disabled={loading}
                                    >
                                        {closerTriggerContent || "Close"}
                                    </Button>
                                </DrawerClose>
                            )}
                        </div>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </ShadCNDrawer>
    );
}
