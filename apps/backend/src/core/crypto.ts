import crypto from "node:crypto";

import { cryptoConfig } from "../config";
import type {
    CryptoAlgorithm,
    CryptoDecryptOptions,
    CryptoEncryptOptions,
} from "../types";

export class OrcaCrypto {
    private key: Buffer;
    private algorithm: CryptoAlgorithm;

    constructor(
        key: string = cryptoConfig.key,
        algorithm: CryptoAlgorithm = "aes-256-gcm",
    ) {
        this.key = Buffer.from(key, "hex");
        this.algorithm = algorithm;
    }

    public encrypt(plaintext: string, options?: CryptoEncryptOptions): string {
        const iv = options?.iv
            ? Buffer.from(options.iv, "hex")
            : crypto.randomBytes(16);
        const algorithm = options?.algorithm ?? this.algorithm;

        const cipher = crypto.createCipheriv(algorithm, this.key, iv);

        const encrypted = Buffer.concat([
            cipher.update(plaintext, "utf-8"),
            cipher.final(),
        ]);

        const authTag = cipher.getAuthTag();

        return `${iv.toString("hex")}:${encrypted.toString("hex")}:${authTag.toString("hex")}`;
    }

    public decrypt(ciphertext: string, options?: CryptoDecryptOptions): string {
        const [ivHex, encryptedHex, authTagHex] = ciphertext.split(":");

        if (!ivHex || !encryptedHex || !authTagHex) {
            throw new Error(
                "Invalid ciphertext format. Expected format: iv:encrypted:authTag",
            );
        }

        const algorithm = options?.algorithm ?? this.algorithm;

        const iv = Buffer.from(ivHex, "hex");
        const encrypted = Buffer.from(encryptedHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");

        const decipher = crypto.createDecipheriv(algorithm, this.key, iv);

        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);

        return decrypted.toString("utf8");
    }
}
