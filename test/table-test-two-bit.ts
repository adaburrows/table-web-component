import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { FieldDefinitions, FieldDefinition, TableStore, Table} from '../src/index';

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
  'b1': new FieldDefinition<TwoBits>({heading: html`2<sup>1</sup>`}),
  'b0': new FieldDefinition<TwoBits>({heading: html`2<sup>0</sup>`})
}

/**
 * Component to test the component. Uses the ScopedRegistryHost mixin. None of
 * these components should be in the global web component registry.
 */
@customElement('table-test-two-bit')
export class TableTestTwoBit extends ScopedRegistryHost(LitElement) {
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
    this.tableStore = new TableStore<TwoBits>({
      tableId: 'two-bit',
      fieldDefs,
      records: [
        { 'b1': 0, 'b0': 0 },
        { 'b1': 0, 'b0': 1 },
        { 'b1': 1, 'b0': 0 },
        { 'b1': 1, 'b0': 1 },
      ],
      caption: "2-bit truth table",
      // Show the header, some usages may not require headings
      showHeader: true
    });
  }

  render() {
    return html`<adaburrows-table .tableStore=${this.tableStore}></adaburrows-table>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-test-two-bit': TableTestTwoBit
  }
}
