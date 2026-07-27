import bcrypt from "bcrypt";

import { bcryptConfig } from "../config";
import { OrcabCryptOptions } from "../types";

export class OrcaBcrypt {
    static async hash(
        data: string,
        options?: OrcabCryptOptions,
    ): Promise<string> {
        return bcrypt.hash(
            data,
            options?.saltRounds ?? bcryptConfig.saltRounds,
        );
    }

    static async fastHash(data: string): Promise<string> {
        return this.hash(data);
    }

    static async compare(data: string, hash: string): Promise<boolean> {
        return bcrypt.compare(data, hash);
    }
}
