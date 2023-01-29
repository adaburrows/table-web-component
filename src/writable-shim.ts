import {
  Subscriber,
  Unsubscriber,
} from "svelte/store";

// Svelte types which are not exported
type Invalidator<T> = (value?: T) => void;
type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>];

export class WritableShim<T extends {}> {
  #_subscribers: Set<SubscribeInvalidateTuple<T>> = new Set();
  #_subscriberQueue: Array<any> = [];
  #_stop?: Unsubscriber;


  /**
   * Calls the subscribers (likely, lit-svelte-store SubscriberStore controllers)
   * to let them know to request an update.
   *
   * This code was gently modified from the "svelte/store" code.
   */
  set(): void {
		if (stop != undefined) { // store is ready
      const run_queue = !this.#_subscriberQueue.length;
      for (const subscriber of this.#_subscribers) {
        subscriber[1]();
        this.#_subscriberQueue.push(subscriber, {});
      }
      if (run_queue) {
        for (let i = 0; i < this.#_subscriberQueue.length; i += 2) {
          this.#_subscriberQueue[i][0](this.#_subscriberQueue[i + 1]);
        }
        this.#_subscriberQueue.length = 0;
      }
    }
	}

  /**
   * Implements the Readable interface.
   *
   * This code was gently modified from the "svelte/store" code.
   */
  subscribe(run: Subscriber<{}>, invalidate: Invalidator<{}> = ()=>{}): Unsubscriber {
    const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate];
		this.#_subscribers.add(subscriber);
		if (this.#_subscribers.size === 1) {
			this.#_stop = ()=>{};
		}
		run({});

		return () => {
			this.#_subscribers.delete(subscriber);
			if (this.#_subscribers.size === 0 && this.#_stop) {
				this.#_stop();
				this.#_stop = undefined;
			}
		};
	}
}