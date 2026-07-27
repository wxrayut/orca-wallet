import { IconWallet } from "@tabler/icons-react";

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "~/components/ui/empty";

type EmptyWalletProps = {
    children?: React.ReactNode;
};

export function EmptyWallet({ children }: EmptyWalletProps) {
    return (
        <Empty className="w-full rounded-lg border border-dashed">
            <EmptyHeader>
                <EmptyMedia className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 md:h-12 md:w-12">
                    <IconWallet className="text-blue-500" size={28} />
                </EmptyMedia>

                <EmptyTitle className="text-md text-center">
                    No Wallet Available
                </EmptyTitle>

                <EmptyDescription className="text-muted-foreground text-center text-xs">
                    You haven't created or imported any wallets yet.
                </EmptyDescription>
            </EmptyHeader>

            <div className="flex flex-col gap-4 md:flex-row">{children}</div>
        </Empty>
    );
}
