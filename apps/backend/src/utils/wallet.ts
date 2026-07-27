import { orcaProvider } from "../blockchain";
import { OrcaWallet } from "../core";
import { WalletService } from "../services";

export async function getWallet(walletId: string) {
    const wallet = await WalletService.getById(walletId);

    if (!wallet) {
        throw new Error("Wallet not found.");
    }

    const w = new OrcaWallet({
        provider: orcaProvider,
        mnemonic: wallet.encryptedMnemonic,
    });

    if (!w.privateKey || !w.address) {
        throw new Error(
            "Failed to derive wallet credentials from the stored encrypted mnemonic.",
        );
    }

    return w;
}
