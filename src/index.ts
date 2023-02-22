export { FieldDefinition, lexicographic, numeric } from './field-definitions'
export type { FieldDefinitions } from './field-definitions'
export { TableStore } from './table-store'
export { TableStoreContext } from './table-context'

import { TableContextElement } from './table-context-element'
import { Table } from './table'

customElements.define('adaburrows-table-context', TableContextElement);
customElements.define('adaburrows-table', Table);

declare global {
  interface HTMLElementTagNameMap {
    "adaburrows-table-context": TableContextElement;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "adaburrows-table": Table;
  }
}
