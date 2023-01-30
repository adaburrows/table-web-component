import { LitElement } from 'lit';
import { TableStore } from './table-store';
/**
 * create react wrapper with instructions on how to wire it up
 */
/**
 * TableContext for wiring up a TableStore without having to pass it down through
 * a bunch of other component props. Mostly useful for tables that are decorated
 * in a nest of other components.
 */
export declare class TableContext extends LitElement {
    store: TableStore<any>;
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
