import { getAddress } from "ethers";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import type {
    CreateWalletForm,
    DeleteWalletForm,
    GetActivityForm,
    GetPriceForm,
    GetPrivateKeyForm,
    GetTokenForm,
    ImportWalletForm,
    SendCryptoForm,
    UpdateWalletDefaultForm,
    UpdateWalletLabelForm,
} from "@orca-wallet/shared";

import {
    handleGetTokenPrices,
    handleWalletCreate,
    handleWalletDelete,
    handleWalletGetActivity,
    handleWalletGetBalance,
    handleWalletGetPrivateKey,
    handleWalletGetTokens,
    handleWalletImport,
    handleWalletSend,
    handleWalletSetDefault,
    handleWalletUpdateLabel,
} from "../handlers";
import { getUserRequest } from "../http";
import { UserService, WalletService } from "../services";
import { Logger, OrcaParser, OrcaResponse } from "../utils";

export class WalletController {
    public static create: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);
            const form = OrcaParser.parse<CreateWalletForm>(request);

            const user = await UserService.getByIdentifier(whoami.email);

            if (!user) {
                return OrcaResponse.Unauthorized(response, "User not found.");
            }

            return handleWalletCreate(response, user, form.label);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while creating wallet",
            );
        }
    };

    public static import: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);
            const form = OrcaParser.parse<ImportWalletForm>(request);

            const user = await UserService.getByIdentifier(whoami.email);

            if (!user) {
                return OrcaResponse.Unauthorized(response, "User not found.");
            }

            return handleWalletImport(response, user, form.label, form.phrase);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while importing wallet",
            );
        }
    };

    public static send: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<SendCryptoForm>(request);

            if (!form.amount) {
                return OrcaResponse.BadRequest(
                    response,
                    `Amount is required to send ${form.symbol}.`,
                );
            }

            if (!form.toAddress) {
                return OrcaResponse.BadRequest(
                    response,
                    `Recipient address is required to send ${form.symbol}.`,
                );
            }

            return handleWalletSend(
                response,
                form.type,
                form.walletId,
                form.symbol,
                form.amount,
                form.toAddress,
            );
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while sending crypto",
            );
        }
    };

    public static getWallets: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const whoami = getUserRequest(request);
            const wallets = await WalletService.getByEmail(whoami.email);
            const filtered = wallets?.map((wallet) => ({
                id: wallet.id,
                label: wallet.label,
                address: getAddress(wallet.address),
                balance: wallet.balance,
                isDefault: wallet.isDefault,
            }));

            return OrcaResponse.Success(response, {
                message: `Wallets for user ${whoami.email}`,
                data: filtered ?? [],
            });
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching wallets",
            );
        }
    };

    public static getBalance: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<GetTokenForm>(request);

            if (!form.walletId) {
                return OrcaResponse.BadRequest(
                    response,
                    "walletId is required to fetch balance",
                );
            }

            return handleWalletGetBalance(response, form.walletId);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching wallet balance",
            );
        }
    };

    public static getPrivateKey: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<GetPrivateKeyForm>(request);

            if (!form.walletId) {
                return OrcaResponse.BadRequest(
                    response,
                    "walletId is required to fetch private key",
                );
            }

            return handleWalletGetPrivateKey(response, form.walletId);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching wallet private key",
            );
        }
    };

    public static getTokens: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<GetTokenForm>(request);

            if (!form.walletId) {
                return OrcaResponse.BadRequest(
                    response,
                    "walletId is required to fetch tokens",
                );
            }

            return handleWalletGetTokens(response, form.walletId);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching wallet tokens",
            );
        }
    };

    public static getActivity: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<GetActivityForm>(request);

            if (!form.walletId) {
                return OrcaResponse.BadRequest(
                    response,
                    "walletId is required to fetch activity",
                );
            }

            return handleWalletGetActivity(response, form.walletId);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching wallet activity",
            );
        }
    };

    public static getTokenPrices: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<GetPriceForm>(request);

            if (!form.symbols || form.symbols.length === 0) {
                return OrcaResponse.BadRequest(
                    response,
                    "At least one symbol is required to fetch prices",
                );
            }

            return handleGetTokenPrices(response, form.symbols);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching token prices",
            );
        }
    };

    public static updateLabel: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<UpdateWalletLabelForm>(request);

            if (!form.walletId) {
                return OrcaResponse.BadRequest(
                    response,
                    "walletId is required to update wallet label",
                );
            }

            if (!form.label || form.label.trim() === "") {
                return OrcaResponse.BadRequest(
                    response,
                    "label is required to update wallet label",
                );
            }

            return handleWalletUpdateLabel(response, form.walletId, form.label);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while updating wallet label",
            );
        }
    };

    public static updateDefault: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<UpdateWalletDefaultForm>(request);

            if (!form.walletId) {
                return OrcaResponse.BadRequest(
                    response,
                    "walletId is required to update wallet default status",
                );
            }

            return handleWalletSetDefault(response, form.walletId, form.isDefault);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while updating wallet default status",
            );
        }
    };

    public static delete: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<DeleteWalletForm>(request);

            if (!form.walletId) {
                return OrcaResponse.BadRequest(
                    response,
                    "walletId is required to delete wallet",
                );
            }

            return handleWalletDelete(response, form.walletId);
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while deleting wallet",
            );
        }
    };
}
