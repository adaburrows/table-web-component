import { Directive } from 'lit/directive.js';
import { TableStore } from './table-store';
/**
 * This class adds in the custom styles based on the store data for each table
 *
 * TODO: need to add more custom styles so individual columns have classes
 */
declare class TableStyleDirective extends Directive {
    render(tableStore: TableStore<any>): import("lit-html").TemplateResult<1>;
}
export declare const renderTableStyles: (tableStore: TableStore<any>) => import("lit-html/directive").DirectiveResult<typeof TableStyleDirective>;
export {};
