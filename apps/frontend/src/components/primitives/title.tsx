import { Separator } from "~/components/ui/separator";

type TitleProps = {
    title: string;
    description?: string;
    separated?: boolean;
};

export function Title({ title, description, separated }: TitleProps) {
    return (
        <div className="mb-5">
            <h1 className="text-gradient text-3xl font-bold">{title}</h1>

            {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
            )}
            {separated && <Separator className="my-5" />}
        </div>
    );
}

export function SectionTitle({ title, description, separated }: TitleProps) {
    return (
        <div className="mb-4">
            <h2 className="text-muted-gradient text-lg font-medium">{title}</h2>

            {description && (
                <p className="text-muted-foreground mt-1 text-sm">
                    {description}
                </p>
            )}
            {separated && <Separator className="my-4" />}
        </div>
    );
}

export function SubsectionTitle({ title, description, separated }: TitleProps) {
    return (
        <div className="mb-3">
            <h3 className="text-muted-gradient text-sm font-medium">{title}</h3>

            {description && (
                <p className="text-muted-foreground mt-1 text-xs">
                    {description}
                </p>
            )}
            {separated && <Separator className="my-3" />}
        </div>
    );
}
