import type { NextFunction, Request, RequestHandler, Response } from "express";

import { DeleteUserForm, UpdateUserForm } from "@orca-wallet/shared";

import { AdminService, UserService, WalletService } from "../services";
import { UserCache } from "../services/user/cache";
import { Logger, OrcaParser, OrcaResponse } from "../utils";

export class AdminController {
    public static getStats: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const stats = await AdminService.getDashBoardStats();

            return OrcaResponse.Success(response, {
                message: "Dashboard statistics fetched successfully",
                data: stats,
            });
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching dashboard statistics",
            );
        }
    };

    public static getRecentTransactions: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const recentTransactions = await AdminService.getRecentTransactions();

            return OrcaResponse.Success(response, {
                message: "Recent Transactions fetched successfully",
                data: recentTransactions,
            });
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching recent transactions",
            );
        }
    };

    public static getUsers: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const users = await AdminService.getUsers();

            return OrcaResponse.Success(response, {
                message: "Users fetched successfully",
                data: users,
            });
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while fetching users",
            );
        }
    };

    public static updateUser: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<UpdateUserForm>(request);

            await UserService.updateById(form.id, {
                username: form.username,
                email: form.email,
            });

            return OrcaResponse.Success(response, {
                message: "User updated successfully",
            });
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while updating user",
            );
        }
    };

    public static deleteUser: RequestHandler = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const form = OrcaParser.parse<DeleteUserForm>(request);

            await AdminService.deleteUserById(form.id);

            return OrcaResponse.Success(response, {
                message: "User deleted successfully",
            });
        } catch (error) {
            Logger.error(error);

            return OrcaResponse.ServerError(
                response,
                "An error occurred while deleting user",
            );
        }
    };
}
