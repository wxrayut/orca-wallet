import { useState } from "react";

import { IconCheck, IconChevronRight, IconX } from "@tabler/icons-react";

import { Dialog } from "~/components/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";

import { useAdmin } from "~/hooks";

import { formatDate } from "~/lib/utils";

import { UpdateUserForm, type User } from "@orca-wallet/shared";

type UserDetailProps = {
    user: User;
};

export default function UserDetail({ user }: UserDetailProps) {
    const { updateUser, deleteUser, updateUserLoading, deleteUserLoading } =
        useAdmin();

    const [form, setForm] = useState<UpdateUserForm>({
        id: user.id,
        username: user.username,
        email: user.email,
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onUpdateClick = async () => {
        await updateUser(form);
    };

    const onDeleteClick = async () => {
        await deleteUser({ id: user.id });
    };

    const triggerContent = (
        <div className="flex w-full items-center justify-between overflow-hidden rounded-xl px-3 py-2">
            <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10">
                    <AvatarImage src={user.avatar ?? undefined} />
                    <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col text-left">
                    <span className="truncate text-sm font-medium">
                        {user.username}
                    </span>

                    <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                    </span>
                </div>
            </div>

            <div className="hidden items-center gap-6 md:flex">
                <div className="flex flex-col items-end">
                    <span className="text-muted-foreground text-xs">Role</span>

                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role}
                    </Badge>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-muted-foreground text-xs">Verified</span>

                    <Badge variant={user.isVerified ? "default" : "destructive"}>
                        {user.isVerified ? "Yes" : "No"}
                    </Badge>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-muted-foreground text-xs">Status</span>

                    <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Active" : "Disabled"}
                    </Badge>
                </div>
            </div>

            <IconChevronRight
                size={18}
                className="text-muted-foreground shrink-0 md:hidden"
            />
        </div>
    );

    return (
        <Dialog
            triggerClassName="w-full h-[64px] rounded-xl mb-2"
            triggerContent={triggerContent}
            headerTitle={`Edit ${user.username}`}
            headerDescription="Manage user account settings and permissions."
            disableFooter
        >
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                        <AvatarImage src={user.avatar ?? undefined} />
                        <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.username}</h3>

                            <Badge
                                variant={
                                    user.role === "ADMIN" ? "default" : "secondary"
                                }
                            >
                                {user.role}
                            </Badge>
                        </div>

                        <p className="text-muted-foreground text-sm">{user.email}</p>
                        <p className="text-muted-foreground text-xs">
                            ID: {user.id}
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h4 className="font-medium">Account Information</h4>

                    <div className="space-y-2">
                        <Label>Username</Label>
                        <Input
                            name="username"
                            value={form.username}
                            onChange={onChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                        />
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h4 className="font-medium">Metadata</h4>
                    <div className="grid gap-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Created At</span>
                            <span>{formatDate(user.createdAt)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Updated At</span>
                            <span>{formatDate(user.updatedAt)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Login</span>
                            <span>
                                {user.lastLogin
                                    ? formatDate(user.lastLogin)
                                    : "Never"}
                            </span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                    <Button
                        onClick={onDeleteClick}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        {deleteUserLoading ? (
                            <>
                                <Spinner />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <IconX size={16} />
                                Delete
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={onUpdateClick}
                        className="button-gradient cursor-pointer text-white"
                    >
                        {updateUserLoading ? (
                            <>
                                <Spinner />
                                Saving...
                            </>
                        ) : (
                            <>
                                <IconCheck size={16} />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
