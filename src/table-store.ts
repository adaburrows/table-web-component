import { createContext } from '@lit-labs/context';
import { FieldDefinition, FieldDefinitions } from "./field-definitions";
import {
  Subscriber,
  Unsubscriber,
  writable,
  Writable,
  derived,
  Readable,
  get
} from "svelte/store";

// Svelte types which are not exported
type Invalidator<T> = (value?: T) => void;
type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator<T>];

/**
 * Allows easily passing in the field definitions and records
 */
interface TableStoreProps<T extends {}> {
  fieldDefs?: FieldDefinitions<T>
  records?: T[]
}

/**
 * The TableStore contains all the code for configuring the table. It exposes a
 * simple interface using getters and setters. It also implements the Svelte
 * store subscriber interface, and the Table uses lit-svelte-stores to listen for
 * changes and call requestUpdate. For simplicity sake, any change using the
 * setters will cause a rerender.
 */
export class TableStore<T extends {}> implements Readable<{}> {
  #_fieldDefs: Writable<FieldDefinitions<T>> = writable({} as FieldDefinitions<T>);
  #_records: Writable<Array<T>> = writable([]);
  #_subscribers: Set<SubscribeInvalidateTuple<T>> = new Set();
  #_subscriberQueue: Array<any> = [];
  #_stop?: Unsubscriber;

  constructor(init: TableStoreProps<T>) {
    if (init.fieldDefs) this.#_fieldDefs.set(init.fieldDefs);
    if (init.records) this.#_records.set(init.records);
  }

  get fieldDefs() {
    return get(this.#_fieldDefs);
  }

  set fieldDefs(fds: FieldDefinitions<T>) {
    this.#_fieldDefs.set(fds);
    this.set();
  }

  get records() {
    return get(this.#_records);
  }

  set records(records: T[]) {
    this.#_records.set(records);
    this.set();
  }

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

  /**
   * Returns a record with the synthesized fields appended to it
   */
  synthesizeFields(record: T) {
    const synthsizedRecord = { ...record } as T;
    const fieldDefs = get(this.#_fieldDefs);
    for (let key in fieldDefs) {
      const synthesizerFunc = fieldDefs[key].synthesizer
      if (synthesizerFunc && typeof synthesizerFunc == 'function') {
        // @ts-ignore
        synthsizedRecord[key] = synthesizerFunc(record);
      }
    }
    return synthsizedRecord;
  }

  /**
   * Returns the headings
   */
  getHeadings(): Readable<string[]> {
    return derived(this.#_fieldDefs,
      (fieldDefs: FieldDefinitions<T>) => Object.values(fieldDefs).map(
        (fieldDef: FieldDefinition<T>) => fieldDef.heading
      )
    );
  }

  /**
   * Returns the keys corresponding to the fields
   */
  getFields(): Readable<string[]> {
    return derived(this.#_fieldDefs, (fieldDefs) => Object.keys(fieldDefs));
  }

  /**
   * Returns the current records with synthesized fields
   */
  getRecords(): Readable<T[]> {
    return derived(this.#_records, (records) => records.map((record) => this.synthesizeFields(record)));
  }

  /**
   * This function is responsible for decorating a field
   */
  decorateField(field: string, element: any) {
    const fieldDefs = get(this.#_fieldDefs);
    if (
      fieldDefs
      && fieldDefs[field]
      && fieldDefs[field].decorator
      && typeof fieldDefs[field].decorator == 'function'
    ) {
      // @ts-ignore
      return fieldDefs[field].decorator(element);
    } else {
      return element;
    }
  }
}

export const TableStoreContext = createContext<TableStore<any>>('adaburrows-table-store');
