export { FieldDefinition, lexicographic, numeric } from './field-definitions'
export type { FieldDefinitions } from './field-definitions'
export { TableStore, TableStoreContext } from './table-store'

import { TableContext } from './table-context-element'
import { Table } from './table'

customElements.define('adaburrows-table-context', TableContext);
customElements.define('adaburrows-table', Table);

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
