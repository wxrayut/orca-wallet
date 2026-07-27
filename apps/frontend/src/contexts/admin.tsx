"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { endpoints } from "~/endpoint";

import {
    type DashBoardStats,
    DeleteUserForm,
    OrcaFetcher,
    type TransactionResponse,
    type UpdateUserForm,
    type User,
} from "@orca-wallet/shared";

type AdminContextType = {
    stats: DashBoardStats;
    recentTransactions: TransactionResponse[];
    users: User[];
    updateUser: (data: UpdateUserForm) => Promise<void>;
    deleteUser: (data: DeleteUserForm) => Promise<void>;
    loading: boolean;
    updateUserLoading: boolean;
    deleteUserLoading: boolean;
};

type AdminProviderProps = {
    children: React.ReactNode;
};

export const AdminContext = createContext<AdminContextType | null>(null);

const DEFAULT_DASHBOARD_STATS: DashBoardStats = {
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    totalWallets: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    userGrowthLastDay: 0,
    userGrowthLastWeek: 0,
    userGrowthLastMonth: 0,
};

export function AdminProvider({ children }: AdminProviderProps) {
    const [stats, setStats] = useState<DashBoardStats>(DEFAULT_DASHBOARD_STATS);
    const [recentTransactions, setRecentTransactions] = useState<
        TransactionResponse[]
    >([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [updateUserLoading, setUpdateUserLoading] = useState(false);
    const [deleteUserLoading, setDeleteUserLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const setMessage = (response: { success: boolean; message: string }) => {
        if (response.success) {
            setSuccessMessage(response.message);
        } else {
            setErrorMessage(response.message);
        }
    };

    const loadStats = async () => {
        setLoading(true);

        try {
            const response = await OrcaFetcher.get<DashBoardStats>(
                endpoints.admin.dashboard.state("v1"),
            );

            setStats(response.data ?? DEFAULT_DASHBOARD_STATS);
        } finally {
            setLoading(false);
        }
    };

    const loadRecentTransactions = async () => {
        setLoading(true);

        try {
            const response = await OrcaFetcher.get<TransactionResponse[]>(
                endpoints.admin.dashboard.recentTransactions("v1"),
            );

            setRecentTransactions(response.data ?? []);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        setLoading(true);

        try {
            const response = await OrcaFetcher.get<User[]>(
                endpoints.admin.users.list("v1"),
            );

            setUsers(response.data ?? []);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (data: UpdateUserForm) => {
        clearMessages();
        setUpdateUserLoading(true);

        try {
            const response = await OrcaFetcher.post(
                endpoints.admin.users.update("v1"),
                data,
            );

            setMessage(response);
            await loadUsers();
        } finally {
            setUpdateUserLoading(false);
        }
    };

    const deleteUser = async (data: DeleteUserForm) => {
        clearMessages();
        setDeleteUserLoading(true);

        try {
            const response = await OrcaFetcher.post(
                endpoints.admin.users.delete("v1"),
                data,
            );

            setMessage(response);
            await loadUsers();
        } finally {
            setDeleteUserLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        loadRecentTransactions();
        loadUsers();
    }, []);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, {
                duration: 2000,
                position: "top-center",
            });
        }
        if (errorMessage) {
            toast.error(errorMessage, {
                duration: 2000,
                position: "top-center",
            });
        }
    }, [successMessage, errorMessage]);

    return (
        <AdminContext.Provider
            value={{
                stats,
                recentTransactions,
                users,
                updateUser,
                deleteUser,
                loading,
                updateUserLoading,
                deleteUserLoading,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}
