import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { TableContext } from './table-context-element';
import { TableStore, TableStoreProps } from './table-store';
import { Table } from './table';
import { FieldDefinitions, FieldDefinition } from './field-definitions';
import { map } from 'lit/directives/map.js';

/**
 * Here's our data schema
 */
type Example = {
  id: string
  name: string
  description: string
  age: number
}

/**
 * Generate a random set of rows
 */
function generateRows(): Example[] {
  const rows: Array<Example> = [];
  for(let i = 0; i < 10; i++) {
    rows.push({
      'id': "" + Math.ceil(Math.random() * 3000),
      'name': btoa("" + Math.random() * 300000000000),
      'description': btoa("" + Math.random() * 300000000000),
      'age': Math.floor(Math.random() * 120)
    });
  }
  return rows;
}

/**
 * This is a example of a set of FieldDefinitions for Example.
 *
 * Notice how we can use the data in the row to synthsize new fields. Also notice
 * how we can wrap the fields in an HTML fragment. This allows composing some
 * incredibly rich table experiences.
 */
const fieldDefs: FieldDefinitions<Example> = {
  'id': new FieldDefinition<Example>({heading: 'ID'}),
  'name': new FieldDefinition<Example>({heading: 'Name'}),
  'description': new FieldDefinition<Example>({heading: 'Desc.'}),
  'age': new FieldDefinition<Example>({
    heading: 'Age (in months)',
    sort: (a: number, b: number) => a - b
  }),
  'synth': new FieldDefinition<Example>({
    heading: 'Age + 12',
    synthesizer: (data: Example) => data.age + 12
  }),
  /**
   * This synthesizes a field that's an array of data from other fields, then it
   * wraps it in a list which is shown in the table.
   */
  'decorated-synth': new FieldDefinition<Example>({
    heading: 'Decorated Synthetic Field',
    synthesizer: (data: Example) => [data.id, data.name, data.age],
    decorator: (field: any) => html`<ul>${map(field, (i) => html`<li><button>${i}</button></li>`)}</ul>`
  })
}

const tableProps: TableStoreProps<Example> = {
  fieldDefs,
  records: [],
  caption: "Howdy! This is a table caption.",
  colGroups: [
    {span: 1, class: 'id-group'},
    {span: 2, class: 'descriptive-group'},
    {span: 2, class: 'numeric-group'},
    {span: 1, class: 'synthetic-group'}
  ],
  sortDirection: 'dsc',
  sortField: 'age',
  // Set up a table footer that sums the values of the age row and the synthetic age row
  footerFunction: (data: Example[]) => {
    const sum1 = data.map((datum) => datum.age).reduce((acc, value) => acc + value, 0);
    //@ts-ignore
    const sum2 = data.map((datum) => datum['synth']).reduce((acc, value) => acc + value, 0);
    return html`<th colspan="3">Totals</th><td class="age">${sum1}</td><td class="synth">${sum2}</td><td></td>`;
  }
}

/**
 * Component to test the component. Uses the ScopedRegistryHost mixin. None of
 * these components should be in the global web component registry.
 */
@customElement('table-test')
export class TableTest extends ScopedRegistryHost(LitElement) {
  static elementDefinitions = {
    'adaburrows-table-context': TableContext,
    'adaburrows-table': Table,
  }

  // This means this component not will rerender, but lit-svelte-stores
  // should cause a requestUpdate() in the component
  tableStore: TableStore<Example>

  constructor() {
    super();
    this.tableStore = new TableStore(tableProps);
  }

  /**
   * Demo showing how to update the table rows with the store's setter.
   */
  newRows() {
    this.tableStore.records = generateRows();
  };

  render() {
    // The following are both valid ways to use the component
    return html`
      <button @click=${this.newRows}>New Rows</button>
      <adaburrows-table .tableStore=${this.tableStore}></adaburrows-table>
      <hr>
      <adaburrows-table-context .store=${this.tableStore}>
        <adaburrows-table></adaburrows-table>
      </adaburrows-table-context>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-test': TableTest
  }
}
