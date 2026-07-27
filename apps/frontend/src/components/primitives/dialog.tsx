import { MouseEventHandler } from "react";

import { Button } from "~/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Dialog as ShadCNDialog,
} from "~/components/ui/dialog";
import { Spinner } from "~/components/ui/spinner";

import { cn } from "~/lib/utils";

type DialogProps = {
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

export function Dialog({
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
    confirmTriggerVariant = "default",
    confirmTriggerClassName,
    confirmTriggerContent,
    disableCloser,
    closerTriggerClassName,
    closerTriggerContent,
    onConfirm,
    loading,
}: DialogProps) {
    return (
        <ShadCNDialog>
            <DialogTrigger asChild>
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
            </DialogTrigger>

            <DialogContent
                className={cn("rounded-md sm:max-w-md", contentClassName)}
            >
                <DialogHeader>
                    <DialogTitle className="text-gradient text-center text-lg sm:text-xl">
                        {headerTitle || ""}
                    </DialogTitle>

                    {headerDescription && (
                        <DialogDescription className="text-center text-xs">
                            {headerDescription}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="mt-4">{children}</div>

                {!disableFooter && (
                    <DialogFooter>
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
                            <DialogClose asChild>
                                <Button
                                    className={cn(
                                        "cursor-pointer rounded-md",
                                        closerTriggerClassName,
                                    )}
                                    disabled={loading}
                                >
                                    {closerTriggerContent || "Close"}
                                </Button>
                            </DialogClose>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </ShadCNDialog>
    );
}
