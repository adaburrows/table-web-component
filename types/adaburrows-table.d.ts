import { LitElement } from 'lit';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class AdaburrowsTable extends LitElement {
    /**
     * The number of times the button has been clicked.
     */
    stuff: {};
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'adaburrows-table': AdaburrowsTable;
    }
}
