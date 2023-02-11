import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { FieldDefinitions, FieldDefinition} from '../src/field-definitions';
import { TableStore } from '../src/table-store';
import { Table } from '../src/table';

/**
 * Here's our data schema
 */
type TwoBits = {
  'b1': number,
  'b0': number
}

/**
 * This is a simple example for a truth table of two bits
 */
const fieldDefs: FieldDefinitions<TwoBits> = {
  'b1': new FieldDefinition<TwoBits>({heading: '2^1'}),
  'b0': new FieldDefinition<TwoBits>({heading: '2^0'})
}

/**
 * Component to test the component. Uses the ScopedRegistryHost mixin. None of
 * these components should be in the global web component registry.
 */
@customElement('table-test-simple')
export class TableTestSimple extends ScopedRegistryHost(LitElement) {
  static elementDefinitions = {
    'adaburrows-table': Table
  }

  // This means this component we are building will not rerender, but the Table's
  // lit-svelte-stores controller should cause a requestUpdate() call by the
  // component
  tableStore: TableStore<TwoBits>

  constructor() {
    super();
    // Set up an example table
    this.tableStore = new TableStore({
      tableId: 'simple',
      fieldDefs,
      records: [
        { 'b1': 0, 'b0': 0 },
        { 'b1': 0, 'b0': 1 },
        { 'b1': 1, 'b0': 0 },
        { 'b1': 1, 'b0': 1 },
      ],
      showHeader: true
    });
  }

  render() {
    return html`<adaburrows-table .tableStore=${this.tableStore}></adaburrows-table>`;
  }

  static styles = css`
  :host {
    /* =================== */
    /* SIMPLE TABLE STYLES */
    /* =================== */

    --table-simple-background-color: var(--color-lt-violet);
    --table-simple-border-style: var(--border-solid);
    --table-simple-border-width: var(--border-1px);

    --table-simple-b1-width: 8em;
    --table-simple-b0-width: 8em;
  }`;
}

declare global {
  interface HTMLElementTagNameMap {
    'table-test-simple': TableTestSimple
  }
}
