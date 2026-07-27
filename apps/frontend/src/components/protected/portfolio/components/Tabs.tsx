import { Separator } from "~/components/ui/separator";
import { Tabs as ShadCNTabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

type TabsProps = {
    tabs: {
        label: string;
        value: string;
    }[];
    children?: React.ReactNode;
};

export default function Tabs({ tabs, children }: TabsProps) {
    return (
        <ShadCNTabs defaultValue="overview">
            <div>
                <TabsList variant="line" className="w-full md:w-75">
                    {tabs.map((t) => (
                        <TabsTrigger
                            key={t.value}
                            value={t.value}
                            className="cursor-pointer text-sm"
                        >
                            {t.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <Separator />
            </div>

            {children}
        </ShadCNTabs>
    );
}
