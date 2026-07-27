"use client";

import { useState } from "react";

import {
    IconPalette,
    IconShieldCheck,
    IconUser,
    IconWallet,
} from "@tabler/icons-react";

import { SectionLayout } from "~/components/layouts";
import { Title } from "~/components/primitives";
import { Loading } from "~/components/system";

import { useAuth } from "~/hooks";

import Account from "./components/Account";
import Appearance from "./components/Appearance";
import Profile from "./components/Profile";
import Security from "./components/Security";
import TabsSelect from "./components/TabsSelect";
import Wallet from "./components/Wallet";

enum SettingsTabs {
    Profile = "profile",
    Account = "account",
    Wallet = "wallet",
    Security = "security",
    Appearance = "appearance",
}

export function Settings() {
    const [selectedTab, setSelectedTab] = useState<string>(SettingsTabs.Profile);

    const { user, initializing } = useAuth();

    if (initializing) return <Loading />;
    if (!user) return null;

    return (
        <SectionLayout className="w-full md:py-5">
            <Title
                title="Settings"
                description="Manage your account settings and preferences."
                separated
            />

            <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full md:w-1/6">
                    <TabsSelect
                        tabs={tabs}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                    />
                </div>

                <div className="flex-1">
                    {selectedTab === SettingsTabs.Profile && <Profile user={user} />}
                    {selectedTab === SettingsTabs.Account && <Account />}
                    {selectedTab === SettingsTabs.Wallet && <Wallet />}
                    {selectedTab === SettingsTabs.Security && <Security />}
                    {selectedTab === SettingsTabs.Appearance && <Appearance />}
                </div>
            </div>
        </SectionLayout>
    );
}

const tabs = [
    {
        icon: IconUser,
        label: "Profile",
        value: SettingsTabs.Profile,
    },
    {
        icon: IconShieldCheck,
        label: "Account",
        value: SettingsTabs.Account,
    },
    {
        icon: IconWallet,
        label: "Wallet",
        value: SettingsTabs.Wallet,
    },
    {
        icon: IconShieldCheck,
        label: "Security",
        value: SettingsTabs.Security,
    },
    {
        icon: IconPalette,
        label: "Appearance",
        value: SettingsTabs.Appearance,
    },
];
