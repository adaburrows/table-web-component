import { Subscriber, Unsubscriber } from "svelte/store";
type Invalidator<T> = (value?: T) => void;
export declare class WritableShim<T extends {}> {
    #private;
    /**
     * Calls the subscribers (likely, lit-svelte-store SubscriberStore controllers)
     * to let them know to request an update.
     *
     * This code was gently modified from the "svelte/store" code.
     */
    set(): void;
    /**
     * Implements the Readable interface.
     *
     * This code was gently modified from the "svelte/store" code.
     */
    subscribe(run: Subscriber<{}>, invalidate?: Invalidator<{}>): Unsubscriber;
}
export {};
