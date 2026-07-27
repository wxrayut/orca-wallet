"use client";

import { useMemo, useState } from "react";

import { SectionLayout } from "~/components/layouts";
import { SectionTitle } from "~/components/primitives";
import { Loading } from "~/components/system";
import { Input } from "~/components/ui/input";

import { useAdmin, useAuth } from "~/hooks";

import UserDetail from "./components/UserDetail";

export function Users() {
    const { initializing } = useAuth();
    const { users } = useAdmin();

    const [search, setSearch] = useState("");

    const filteredUsers = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return users;

        return users.filter((user) => {
            return (
                user.username.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                user.role.toLowerCase().includes(keyword)
            );
        });
    }, [users, search]);

    if (initializing) return <Loading />;

    return (
        <SectionLayout className="md:py-6">
            <SectionTitle
                title="Users"
                description="Manage your users and their roles here."
            />

            <div className="w-full md:w-1/4">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search username, email, role..."
                />
            </div>

            <div className="mt-4 space-y-3">
                {filteredUsers.map((user) => (
                    <UserDetail key={user.id} user={user} />
                ))}
            </div>
        </SectionLayout>
    );
}
