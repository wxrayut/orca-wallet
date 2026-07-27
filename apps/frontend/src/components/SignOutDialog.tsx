import { IconAlertTriangle, IconLogout } from "@tabler/icons-react";

import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";

type SignOutDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void> | void;
    loading?: boolean;
};

export function SignOutDialog({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
}: SignOutDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-3xl **:data-[slot=dialog-close]:hidden sm:max-w-md">
                <DialogHeader className="space-y-4 text-center">
                    <div className="bg-destructive/10 mx-auto flex size-14 items-center justify-center rounded-2xl">
                        <IconAlertTriangle className="text-destructive" size={22} />
                    </div>

                    <div>
                        <DialogTitle className="text-xl font-medium">
                            Sign out?
                        </DialogTitle>

                        <DialogDescription className="mt-2 text-sm">
                            You'll need to sign in again to access your account.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="cursor-pointer rounded-md"
                    >
                        Stay signed in
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onConfirm}
                        disabled={loading}
                        className="button-gradient cursor-pointer rounded-md"
                    >
                        {loading ? "Signing out..." : "Sign out"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
