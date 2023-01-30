import { html, TemplateResult } from 'lit';
import { createContext } from '@lit-labs/context';
import { FieldDefinition, FieldDefinitions } from "./field-definitions";
import {
  writable,
  Writable,
  derived,
  Readable,
  get
} from "svelte/store";
import { WritableShim } from './writable-shim';

/**
 * Column Group Interface for setting attributes on <col> elements
 */
export interface ColGroup {
  span?: number,
  class?: string
}

export type SortDirection = 'asc' | 'dsc' | 'na';
type FooterFunc<T> = (data: T[]) => TemplateResult

/**
 * Allows easily passing in the field definitions and records
 */
export interface TableStoreProps<T extends {}> {
  fieldDefs?: FieldDefinitions<T>
  records?: T[],
  caption?: string,
  colGroups?: ColGroup[],
  sortField?: string,
  sortDirection?: SortDirection,
  showHeader?: boolean,
  footerFunction?: FooterFunc<T>
}

/**
 * The TableStore contains all the code for configuring the table. It exposes a
 * simple interface using getters and setters. It also implements the Svelte
 * store subscriber interface, and the Table uses lit-svelte-stores to listen for
 * changes and call requestUpdate. For simplicity sake, any change using the
 * setters will cause a rerender.
 */
export class TableStore<T extends object> extends WritableShim<{}> implements Readable<{}> {
  #_fieldDefs: Writable<FieldDefinitions<T>> = writable({} as FieldDefinitions<T>);
  #_records: Writable<Array<T>> = writable([]);
  #_caption: Writable<string | undefined> = writable(undefined);
  #_colGroups: Writable<Array<ColGroup>> = writable([]);
  #_sortDirection: Writable<SortDirection> = writable('na');
  #_sortField: Writable<string> = writable('');
  #_showHeader: Writable<boolean> = writable(false);
  #_footerFunction: Writable<FooterFunc<T>> = writable((_: T[]) => html``)

  constructor(init: TableStoreProps<T>) {
    super();
    if (init.fieldDefs) this.#_fieldDefs.set(init.fieldDefs);
    if (init.records) this.#_records.set(init.records);
    if (init.caption) this.#_caption.set(init.caption);
    if (init.colGroups) this.#_colGroups.set(init.colGroups);
    if (init.sortDirection) this.#_sortDirection.set(init.sortDirection);
    if (init.sortField) this.#_sortField.set(init.sortField);
    if (init.showHeader) this.#_showHeader.set(init.showHeader);
    if (init.footerFunction && typeof init.footerFunction == 'function') {
      this.#_footerFunction.set(init.footerFunction)
    }
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

  get caption() {
    return get(this.#_caption);
  }

  set caption(caption) {
    this.#_caption.set(caption);
    this.set();
  }

  get colGroups() {
    return get(this.#_colGroups);
  }

  set colGroups(colGroups) {
    this.#_colGroups.set(colGroups);
    this.set();
  }

  get sortDirection() {
    return get(this.#_sortDirection);
  }

  set sortDirection(direction: SortDirection) {
    this.#_sortDirection.set(direction);
    this.set();
  }

  get sortField() {
    return get(this.#_sortField);
  }

  set sortField(field: string) {
    this.#_sortField.set(field);
    this.set();
  }

  get showHeader() {
    return get(this.#_showHeader);
  }

  set showHeader(sh: boolean) {
    this.#_showHeader.set(sh);
    this.set();
  }

  get footerFunction() {
    return get(this.#_footerFunction);
  }

  set footerFunction(ff: FooterFunc<T>) {
    this.#_footerFunction.set(ff);
    this.set();
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
   * Returns a sorting function or undefined
   */
  getSortingFunction() {
    if (
      this.sortField != ''
      && this.fieldDefs[this.sortField]
      && this.fieldDefs[this.sortField].sort
    ) {
      const sort = this.fieldDefs[this.sortField].sort;
      // @ts-ignore
      return (a: T, b: T) => sort(a[this.sortField], b[this.sortField])
    } else {
      return (_a: T, _b: T) => 0;
    }
  }

  /**
   * Sorts rows after fields are synthesized
   */
  sort(originalRecords: T[]): T[] {
    const records = [...originalRecords];
    if (
      this.sortDirection != 'na'
      && this.sortField != ''
      && this.fieldDefs[this.sortField]
      && this.fieldDefs[this.sortField].sort
    ) {
      const ascending = records.sort(this.getSortingFunction());
      if (this.sortDirection === 'dsc') {
        return ascending.reverse();
      }
      return ascending;
    }
    return records;
  }

  /**
   * Returns the current records with synthesized fields
   */
  getRecords(): Readable<T[]> {
    return derived(
      this.#_records,
      (records) => this.sort(records.map(
        (record) => this.synthesizeFields(record)
      ))
    );
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
