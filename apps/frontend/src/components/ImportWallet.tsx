"use client";

import { useRef, useState } from "react";

import { IconUpload } from "@tabler/icons-react";
import { toast } from "sonner";

import { Drawer, FloatingInput, FloatingInputRef } from "~/components/primitives";
import { Label } from "~/components/ui/label";

import { useWallet } from "~/hooks";

import type { ImportWalletForm } from "@orca-wallet/shared";

type ImportWalletProps = {};

export function ImportWallet({}: ImportWalletProps) {
    const { wallets, importWallet, loading } = useWallet();

    const [form, setForm] = useState<ImportWalletForm>({
        label: `My Wallet ${wallets ? wallets.length + 1 : 1}`,
        phrase: "",
    });
    const [words, setWords] = useState<string[]>(Array(12).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const clearForm = () => {
        setForm({
            label: `My Wallet ${wallets ? wallets.length + 1 : 1}`,
            phrase: "",
        });
        setWords(Array(12).fill(""));

        inputsRef.current.forEach((input) => {
            if (input) {
                input.value = "";
            }
        });
    };

    const onChangeLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            label: e.target.value,
        }));
    };

    const onChangePhrase = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, placeholder } = e.target;

        const index = parseInt(placeholder) - 1;
        const newWords = [...words];

        newWords[index] = value;

        setWords(newWords);
        setForm((prev) => ({
            ...prev,
            phrase: newWords.join(" "),
        }));
    };

    const onPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData
            .getData("text")
            .toLowerCase()
            .trim()
            .split(/\s+/);

        if (pasted.length !== 12) {
            return;
        }

        e.preventDefault();

        setWords((prev) => {
            const updated = [...prev];

            pasted.forEach((word, index) => {
                updated[index] = word;
                const input = inputsRef.current[index];

                if (input) {
                    input.value = word;
                }
            });

            return updated;
        });
        setForm((prev) => ({
            ...prev,
            phrase: pasted.join(" "),
        }));
    };

    const handleRef = (index: number) => (e: HTMLInputElement | null) => {
        inputsRef.current[index] = e;
    };

    const onConfirm = async () => {
        toast.promise(importWallet(form), {
            loading: "Importing your wallet...",
            success: () => {
                clearForm();
                return "Your wallet has been imported successfully.";
            },
            error: "We couldn’t import your wallet. Please check your seed phrase and try again.",
            duration: 1000,
            position: "top-center",
        });
    };

    return (
        <Drawer
            triggerClassName="button-gradient hover:text-white rounded-lg"
            triggerContent={
                <>
                    <IconUpload size={16} />
                    <span>Import Wallet</span>
                </>
            }
            headerTitle="Import your wallet"
            headerDescription="Enter your 12-word seed phrase to import your wallet"
            confirmTriggerClassName="button-gradient text-white"
            confirmTriggerContent="Import Wallet"
            closerTriggerContent="Cancel"
            onConfirm={onConfirm}
            loading={loading}
        >
            <Label className="text-xs">Wallet Label (optional)</Label>

            <FloatingInput
                label=""
                className="mt-3"
                placeholder=""
                value={form.label}
                onChange={onChangeLabel}
            />

            <div className="mt-3">
                <Label className="text-xs">Seed Phrase</Label>

                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {words.map((word, index) => (
                        <FloatingInputRef
                            key={index}
                            label=""
                            placeholder={`${index + 1}`}
                            className="text-center"
                            value={word}
                            onChange={onChangePhrase}
                            onPaste={onPaste}
                            ref={handleRef(index)}
                        />
                    ))}
                </div>
            </div>
        </Drawer>
    );
}
