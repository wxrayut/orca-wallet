import { CreateWallet } from "~/components/CreateWallet";
import { ImportWallet } from "~/components/ImportWallet";
import { SubsectionTitle } from "~/components/primitives";
import { TabsContent } from "~/components/ui/tabs";

import type { Wallet } from "@orca-wallet/shared";

import EthereumChart from "./components/Chart";
import Receive from "./components/Receive";
import Send from "./components/Send";

type OverviewProps = {
    activeWallet?: Wallet | null;
};

export default function Overview({ activeWallet }: OverviewProps) {
    return (
        <TabsContent value="overview">
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
                <div className="flex flex-col gap-4">
                    <SubsectionTitle
                        title="Portfolio Overview"
                        description="Get a snapshot of your portfolio's performance."
                    />

                    <EthereumChart />
                    {/*
                     <div className="bg-card flex h-full flex-col gap-4 rounded-lg border p-4">
                        <EthereumChart />
                    </div> 
                    */}
                </div>

                <div className="flex flex-col gap-4">
                    <SubsectionTitle
                        title="Quick Actions"
                        description="Perform quick actions on your wallet."
                    />

                    <div className="from-card to-muted/40 relative flex flex-col gap-4 overflow-hidden rounded-lg border bg-linear-to-br p-4 backdrop-blur">
                        <div className="flex justify-between gap-2">
                            <div className="flex-1">
                                <Send activeWallet={activeWallet} />
                            </div>
                            <div className="flex-1">
                                <Receive activeWallet={activeWallet} />
                            </div>
                        </div>
                        <CreateWallet />
                        <ImportWallet />
                    </div>
                </div>
            </div>
        </TabsContent>
    );
}
