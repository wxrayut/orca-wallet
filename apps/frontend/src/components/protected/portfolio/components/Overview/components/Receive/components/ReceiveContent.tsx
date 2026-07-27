import { IconCheck, IconCopy } from "@tabler/icons-react";
import QRCode from "react-qr-code";

type ReceiveContentProps = {
    address: string;
    isCopied: boolean;
    copyToClipboard: () => void;
};

export default function ReceiveContent({
    address,
    isCopied,
    copyToClipboard,
}: ReceiveContentProps) {
    return (
        <div className="space-y-6">
            <div className="bg-muted/40 flex flex-col items-center justify-center rounded-md border p-6 shadow-sm">
                <div className="rounded-md bg-white p-4">
                    <QRCode value={address} size={180} />
                </div>

                <p className="text-muted-foreground mt-4 text-center text-xs">
                    Scan QR code to send crypto
                </p>
            </div>

            <div className="bg-muted/40 rounded-md border p-3">
                <p className="text-muted-foreground mb-1 text-xs">Wallet address</p>

                <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs">{address}</p>

                    <button
                        onClick={copyToClipboard}
                        className="hover:bg-muted shrink-0 cursor-pointer rounded-lg p-2 transition"
                    >
                        {isCopied ? (
                            <IconCheck className="text-green-500" size={16} />
                        ) : (
                            <IconCopy className="text-muted-foreground" size={16} />
                        )}
                    </button>
                </div>
            </div>

            <p className="text-muted-foreground text-center text-xs">
                Only send supported assets to this address. Sending other assets may
                result in permanent loss.
            </p>
        </div>
    );
}
