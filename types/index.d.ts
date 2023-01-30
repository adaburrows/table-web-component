import { TableContext } from './table-context-element';
import { Table } from './table';
declare global {
    interface HTMLElementTagNameMap {
        "adaburrows-table-context": TableContext;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "adaburrows-table": Table;
    }
}
