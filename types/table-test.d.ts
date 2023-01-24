import { LitElement } from 'lit';
import { AdaburrowsTable } from './adaburrows-table';
declare const TestTable_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements").ScopedElementsHost> & typeof import("@open-wc/scoped-elements").ScopedElementsHost;
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class TestTable extends TestTable_base {
    stuff: {
        greeting: string;
        subject: string;
    };
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
    static get scopedElements(): {
        'adaburrows-table': typeof AdaburrowsTable;
    };
}
declare global {
    interface HTMLElementTagNameMap {
        'test-table': TestTable;
    }
}
export {};
