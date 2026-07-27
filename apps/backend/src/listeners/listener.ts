import type { ListenerFactory, ListenerState } from "../types";
import { Logger } from "../utils";

export class Listener {
    private registry = new Map<string, ListenerFactory>();
    private state = new Map<string, ListenerState>();

    public register(name: string, factory: ListenerFactory) {
        this.registry.set(name, factory);
        this.state.set(name, { enabled: false });
    }

    public enable(name: string) {
        const factory = this.registry.get(name);
        const current = this.state.get(name);

        if (!factory || current?.enabled) {
            return;
        }

        const unsubscribe = factory();

        this.state.set(name, {
            enabled: true,
            unsubscribe,
        });

        Logger.info("Listener", `${name} listener enabled`);
    }

    public reload(name: string) {
        this.disable(name);
        this.enable(name);

        Logger.info("Listener", `${name} listener reloaded`);
    }

    public disable(name: string) {
        const current = this.state.get(name);

        if (!current?.enabled) {
            return;
        }

        current.unsubscribe?.();
        this.state.set(name, { enabled: false });

        Logger.info("Listener", `${name} listener disabled`);
    }

    public start() {
        for (const name of this.registry.keys()) {
            this.enable(name);
        }
    }

    public status() {
        return Array.from(this.state.entries()).map(([name, s]) => ({
            name,
            enabled: s.enabled,
        }));
    }

    public stop() {
        for (const name of this.registry.keys()) {
            this.disable(name);
        }
    }
}

export const listener = new Listener();
