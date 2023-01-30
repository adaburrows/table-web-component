import { TemplateResult } from 'lit';
import { FieldDefinitions } from "./field-definitions";
import { Readable } from "svelte/store";
import { WritableShim } from './writable-shim';
/**
 * Column Group Interface for setting attributes on <col> elements
 */
export interface ColGroup {
    span?: number;
    class?: string;
}
export type SortDirection = 'asc' | 'dsc' | 'na';
type FooterFunc<T> = (data: T[]) => TemplateResult;
/**
 * Allows easily passing in the field definitions and records
 */
export interface TableStoreProps<T extends {}> {
    fieldDefs?: FieldDefinitions<T>;
    records?: T[];
    caption?: string;
    colGroups?: ColGroup[];
    sortField?: string;
    sortDirection?: SortDirection;
    showHeader?: boolean;
    footerFunction?: FooterFunc<T>;
}
/**
 * The TableStore contains all the code for configuring the table. It exposes a
 * simple interface using getters and setters. It also implements the Svelte
 * store subscriber interface, and the Table uses lit-svelte-stores to listen for
 * changes and call requestUpdate. For simplicity sake, any change using the
 * setters will cause a rerender.
 */
export declare class TableStore<T extends object> extends WritableShim<{}> implements Readable<{}> {
    #private;
    constructor(init: TableStoreProps<T>);
    get fieldDefs(): FieldDefinitions<T>;
    set fieldDefs(fds: FieldDefinitions<T>);
    get records(): T[];
    set records(records: T[]);
    get caption(): string | undefined;
    set caption(caption: string | undefined);
    get colGroups(): ColGroup[];
    set colGroups(colGroups: ColGroup[]);
    get sortDirection(): SortDirection;
    set sortDirection(direction: SortDirection);
    get sortField(): string;
    set sortField(field: string);
    get showHeader(): boolean;
    set showHeader(sh: boolean);
    get footerFunction(): FooterFunc<T>;
    set footerFunction(ff: FooterFunc<T>);
    /**
     * Returns a record with the synthesized fields appended to it
     */
    synthesizeFields(record: T): T;
    /**
     * Returns the headings
     */
    getHeadings(): Readable<string[]>;
    /**
     * Returns the keys corresponding to the fields
     */
    getFields(): Readable<string[]>;
    /**
     * Returns a sorting function or undefined
     */
    getSortingFunction(): (a: T, b: T) => number;
    /**
     * Sorts rows after fields are synthesized
     */
    sort(originalRecords: T[]): T[];
    /**
     * Returns the current records with synthesized fields
     */
    getRecords(): Readable<T[]>;
    /**
     * This function is responsible for decorating a field
     */
    decorateField(field: string, element: any): any;
}
export declare const TableStoreContext: {
    __context__: TableStore<any>;
};
export {};
