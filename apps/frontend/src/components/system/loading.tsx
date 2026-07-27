import { OrcaIcon } from "../OrcaIcon";
import { SectionLayout } from "../layouts";
import { Fade } from "../motion";

export function Loading() {
    return (
        <SectionLayout
            className="flex"
            innerClassName="flex items-center justify-center"
        >
            <Fade>
                <div className="flex flex-col items-center justify-center space-y-16 text-center">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full">
                        <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
                        <OrcaIcon size={64} className="absolute" />
                        <div className="h-28 w-28 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-md tracking-wide">Loading...</p>
                        <p className="text-muted-foreground text-sm">
                            Syncing with the ocean...
                        </p>
                    </div>
                </div>
            </Fade>
        </SectionLayout>
    );
}
