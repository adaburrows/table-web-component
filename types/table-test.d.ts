import { LitElement } from 'lit';
import { TableContext } from './table-context-element';
import { TableStore } from './table-store';
import { Table } from './table';
/**
 * Here's our data schema
 */
type Example = {
    id: string;
    name: string;
    description: string;
    age: number;
};
declare const TableTest_base: typeof LitElement;
/**
 * Component to test the component. Uses the ScopedRegistryHost mixin. None of
 * these components should be in the global web component registry.
 */
export declare class TableTest extends TableTest_base {
    static elementDefinitions: {
        'adaburrows-table-context': typeof TableContext;
        'adaburrows-table': typeof Table;
    };
    tableStore: TableStore<Example>;
    constructor();
    /**
     * Demo showing how to update the table rows with the store's setter.
     */
    newRows(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'table-test': TableTest;
    }
}
export {};
