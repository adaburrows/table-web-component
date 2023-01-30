import { LitElement, TemplateResult } from 'lit';
import { StoreSubscriber } from 'lit-svelte-stores';
import { FieldDefinitions } from './field-definitions';
import { TableStore } from './table-store';
declare const Table_base: typeof LitElement;
/**
 * Table component that supports creating synthetic fields, decorating fields
 * with components, setting up colgroups, and sorting.
 */
export declare class Table extends Table_base {
    storeSubscriber: StoreSubscriber<{}>;
    /**
     * This property can either be provided directly, or can be provided by a context
     */
    tableStore: TableStore<any>;
    constructor();
    /**
     * Render the caption
     */
    caption(): TemplateResult;
    /**
     * Render the <colgroup> and <col>s.
     */
    colGroup(): TemplateResult;
    /**
     * Render sorting indicators according to state
     */
    sortIndicator(fieldDefs: FieldDefinitions<any>, field: string): TemplateResult<1>;
    /**
     *
     */
    headerHandler(field: string): () => void;
    /**
     * Render the heading for column, adding sorting controls if sort function is present
     *
     * Table behavior:
     * - clicking on sortable headings are stateful
     * - if new column selection, reset to 'asc' sort and set sortField
     * - if same column selected again, change to 'dsc'
     * - if same column selected thrice, change to 'na' and remove sortField
     */
    heading(field: string): TemplateResult;
    /**
     * Render the header
     * TODO: make this header into a configurable function like the footer, that way more
     *   complicated headers with multiple rows of headings that may span colgroups
     *   can be added.
     */
    header(): TemplateResult;
    /**
     * Render a row
     */
    row(record: any, fields: string[]): TemplateResult;
    /**
     * Render the rows in the body.
     */
    body(): TemplateResult;
    /**
     * Render the footer.
     */
    foot(): TemplateResult;
    /**
     * Renders the table based on current data and table state
     */
    render(): TemplateResult;
    /**
     * Styles that don't change per component instance
     */
    static styles: import("lit").CSSResult[];
}
export {};
