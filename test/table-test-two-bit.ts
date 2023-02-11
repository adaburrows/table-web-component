import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { TableContext } from '../src/table-context-element';
import { TableStore } from '../src/table-store';
import { Table } from '../src/table';
import { FieldDefinitions, FieldDefinition} from '../src/field-definitions';

/**
 * Here's our data schema
 */
type TwoBits = {
  'b1': boolean,
  'b0': boolean
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
    'adaburrows-table-context': TableContext,
    'adaburrows-table': Table,
  }

  // This means this component not will rerender, but lit-svelte-stores
  // should cause a requestUpdate() in the component
  tableStore: TableStore<TwoBits>

  constructor() {
    super();
    // Set up an example table
    this.tableStore = new TableStore({
      tableId: 'two-bit',
      fieldDefs,
      records: [
        { 'b1': false, 'b0': false },
        { 'b1': false, 'b0': true  },
        { 'b1': true,  'b0': false },
        { 'b1': true,  'b0': true  },
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
