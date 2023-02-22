import { TemplateValue, RowFunc, FieldDefinition, FieldDefinitions, FieldDefinitionMap } from "./field-definitions";
import { Readable } from "svelte/store";
import { WritableShim } from './writable-shim';

/**
 * Column Group for setting attributes on <col> elements
 */
export type ColGroup = {
  span?: number,
  class?: string
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc' | 'na';

/**
 * Convenience type for Row rendering
 */
export type RowValue = {
  field: string;
  value: any;
}

/**
 * Allows easily passing in the field definitions and records
 */
export interface TableStoreProps<T extends {}> {
  tableId: string
  fieldDefs?: {}
  records?: T[]
  caption?: TemplateValue
  colGroups?: ColGroup[]
  sortField?: string
  sortDirection?: SortDirection
  showHeader?: boolean
  footerFunction?: RowFunc<T>
}

/**
 * The TableStore contains all the code for configuring the table. It exposes a
 * simple interface using getters and setters. It also implements the Svelte
 * store subscriber interface, and the Table uses lit-svelte-stores to listen for
 * changes and call requestUpdate.
 *
 * Any call to the setters will cause the table to re-render. Even if the private
 * fields were their own separate derrived stores, the limitations of lit-svelte-
 * stores essentially means that the same behavior would result from the previous
 * more complicated code where every property was wrapped in a writable.
 *
 * This seems to be a common problem, and it could probably be gotten around if
 * each cell (including caption) had a component that wrapped the value to be
 * displayed and then that used the lit-svelte-stores controller to listen to the
 * derived value.
 *
 * An additional interesting problem is that of two way data binding, where cells
 * can have edit in place functionality. There would need to be a simple map back
 * from the derived cell store to the original writable store.
 */
export class TableStore<T extends object> extends WritableShim<{}> implements Readable<{}> {
  #_tableId: string = 'AdaTable';
  #_fieldDefs: FieldDefinitionMap<T> = new Map<string, FieldDefinition<T>>();
  #_records: Array<T> = [];
  #_caption: TemplateValue = undefined;
  #_colGroups: Array<ColGroup> = [];
  #_sortDirection: SortDirection = 'na';
  #_sortField: string = '';
  #_showHeader: boolean = false;
  #_footerFunction: RowFunc<T> = undefined;

  constructor(init: TableStoreProps<T>) {
    super();
    if (init.tableId) this.#_tableId = init.tableId;
    if (init.fieldDefs) this.#_fieldDefs = new Map(Object.entries(init.fieldDefs));
    if (init.records) this.#_records = init.records;
    if (init.caption) this.#_caption = init.caption;
    if (init.colGroups) this.#_colGroups = init.colGroups;
    if (init.sortDirection) this.#_sortDirection = init.sortDirection;
    if (init.sortField) this.#_sortField = init.sortField;
    if (init.showHeader) this.#_showHeader = init.showHeader;
    if (init.footerFunction && typeof init.footerFunction == 'function') {
      this.#_footerFunction = init.footerFunction
    }
  }

  get tableId() {
    return this.#_tableId;
  }

  set tableId(id: string) {
    this.#_tableId = id;
    this.set();
  }

  get fieldDefs() {
    return Object.fromEntries(this.#_fieldDefs.entries());
  }

  set fieldDefs(fds: FieldDefinitions<T>) {
    this.#_fieldDefs = new Map(Object.entries(fds));
    this.set();
  }

  get records() {
    return this.#_records;
  }

  set records(records: T[]) {
    this.#_records = records ;
    this.set();
  }

  get caption() {
    return this.#_caption;
  }

  set caption(caption) {
    this.#_caption = caption;
    this.set();
  }

  get colGroups() {
    return this.#_colGroups;
  }

  set colGroups(colGroups) {
    this.#_colGroups = colGroups;
    this.set();
  }

  get sortDirection() {
    return this.#_sortDirection;
  }

  set sortDirection(direction: SortDirection) {
    this.#_sortDirection = direction;
    this.set();
  }

  get sortField() {
    return this.#_sortField;
  }

  set sortField(field: string) {
    this.#_sortField = field;
    this.set();
  }

  get showHeader() {
    return this.#_showHeader;
  }

  set showHeader(sh: boolean) {
    this.#_showHeader = sh;
    this.set();
  }

  get footerFunction() {
    return this.#_footerFunction;
  }

  set footerFunction(ff: RowFunc<T>) {
    this.#_footerFunction = ff;
    this.set();
  }

  /**
   * Returns a sorting function or undefined
   */
  #_getSortingFunction() {
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
  #_sort(originalRecords: T[]): T[] {
    const records = [...originalRecords];
    if (
      this.sortDirection != 'na'
      && this.sortField != ''
      && this.fieldDefs[this.sortField]
      && this.fieldDefs[this.sortField].sort
    ) {
      const ascending = records.sort(this.#_getSortingFunction());
      if (this.sortDirection === 'desc') {
        return ascending.reverse();
      }
      return ascending;
    }
    return records;
  }

  /**
   * Returns the headings as a RowValue array
   */
  getHeadings(): RowValue[] {
    return Array.from(this.#_fieldDefs.entries()).map(
      (entry: [ string, FieldDefinition<T> ]) => ({ field: entry[0], value: entry[1].heading })
    );
  }

  /**
   * Returns the keys corresponding to the fields
   */
  getFields(): string[] {
    return Array.from(this.#_fieldDefs.keys());
  }

  /**
   * Returns a record with the synthesized fields appended to it
   */
  synthesizeFields(record: T): T {
    const synthsizedRecord = { ...record };
    for (let [key, value] of this.#_fieldDefs) {
      const { synthesizer } = value;
      if (synthesizer && typeof synthesizer == 'function') {
        // @ts-ignore
        synthsizedRecord[key] = synthesizer(record);
      }
    }
    return synthsizedRecord;
  }

  /**
   * Returns the current records with synthesized fields
   */
  getRecords(): T[] {
    return this.#_sort(this.#_records.map(
      (record) => this.synthesizeFields(record)
    ));
  }

  /**
   * Optimized row fetcher
   */
  getRows(): RowValue[][] {
    const fieldDefs = this.#_fieldDefs;
    return this.#_sort(this.#_records.map(
      (record) => {
        const synthsizedRecord = { ...record };
        for (let [field, fieldDef] of fieldDefs) {
          // Functions to synthesize and decorate fields
          const { synthesizer, decorator } = fieldDef;

          // Synthesize the current field if we have a synthesizerFunc
          if (synthesizer && typeof synthesizer == 'function') {
            // @ts-ignore
            synthsizedRecord[field] = synthesizer(record);
          }

          // decorate the current field if we have a decorator
          if(decorator && typeof decorator == 'function') {
            // @ts-ignore
            synthsizedRecord[field] = decorator(synthsizedRecord[field]);
          }
        }
        return synthsizedRecord;
      }
    )).map(
      (rec: T) => Array.from(
        Object.entries(rec)
      ).map(
        (entry: [string, any]) => ({field: entry[0], value: entry[1]})
      )
    );
  }

}
