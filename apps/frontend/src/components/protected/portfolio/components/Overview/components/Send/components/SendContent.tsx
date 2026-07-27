import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";

import type {
    NativeBalance,
    SendCryptoForm,
    TokenBalance,
} from "@orca-wallet/shared";

type SendContentProps = {
    token: NativeBalance | TokenBalance;
    form: SendCryptoForm;
    setForm: (form: SendCryptoForm) => void;
    onConfirm: () => void;
    loading: boolean;
    children?: React.ReactNode;
};

export default function SendContent({
    token,
    form,
    setForm,
    onConfirm,
    loading,
    children,
}: SendContentProps) {
    const updateForm = (field: keyof SendCryptoForm, value: string) => {
        setForm({
            ...form,
            [field]: field === "amount" ? value.replace(/[^0-9.]/g, "") : value,
        });
    };

    return (
        <div>
            <div className="space-y-3 rounded-t-lg border p-4">
                <p className="text-muted-foreground text-sm">You’re sending</p>

                <div className="flex items-center justify-center">
                    <input
                        name="amount"
                        value={form.amount}
                        placeholder="0"
                        className="w-full bg-transparent text-center text-6xl font-medium outline-none"
                        onChange={(e) => updateForm("amount", e.target.value)}
                    />
                </div>

                <div className="text-muted-foreground cursor-pointer text-center text-sm hover:opacity-80">
                    {token?.kind === "NATIVE" ? "ETH" : token?.symbol}
                </div>
            </div>

            {children}

            <div className="mt-3 space-y-3 rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">You’re receiving</p>

                <div className="flex items-center justify-center">
                    <input
                        name="toAddress"
                        value={form.toAddress}
                        placeholder="Wallet address"
                        className="w-full bg-transparent text-xl font-light outline-none"
                        onChange={(e) => updateForm("toAddress", e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-muted mt-3">
                <Button
                    className="button-gradient text-foreground h-12 w-full cursor-pointer rounded-xl"
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? <Spinner /> : "Confirm"}
                </Button>
            </div>
        </div>
    );
}
