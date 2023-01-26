import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { TableContext } from './table-context-element';
import { TableStore } from './table-store';
import { Table } from './table';
import { FieldDefinitions, FieldDefinition } from './field-definitions';
import { map } from 'lit/directives/map.js';

/**
 * Here's our data schema
 */
type Datatype = {
  id: string
  name: string
  description: string
  age: number
}

/**
 * This generates a random table row
 */
function generateDatum(): Datatype {
  return {
    'id': "" + Math.ceil(Math.random() * 3000),
    'name': btoa("" + Math.random() * 300000000000),
    'description': btoa("" + Math.random() * 300000000000),
    'age': Math.floor(Math.random() * 120)
  };
}

/**
 * This is a example of a set of FieldDefinitions.
 *
 * Notice how we can use the data in the row to synthsize new fields. Also notice
 * how we can wrap the fields in an HTML fragment. This allows composing some
 * incredibly rich table experiences.
 */
const fieldDefs: FieldDefinitions<Datatype> = {
  'id': new FieldDefinition<Datatype>({heading: 'ID'}),
  'name': new FieldDefinition<Datatype>({heading: 'Name'}),
  'description': new FieldDefinition<Datatype>({heading: 'Desc.'}),
  'age': new FieldDefinition<Datatype>({heading: 'Age (in months)'}),
  'synth': new FieldDefinition<Datatype>({
    heading: 'Age + 12',
    synthesizer: (data: Datatype) => data.age + 12
  }),
  /**
   * This synthesizes a field that's an array of data from other fields, then it
   * wraps it in a list which is shown in the table.
   */
  'decorated-synth': new FieldDefinition<Datatype>({
    heading: 'Decorated Synthetic Field',
    synthesizer: (data: Datatype) => [data.id, data.name, data.age],
    decorator: (field: any) => html`<ul>${map(field, (i) => html`<li>${i}</li>`)}</ul>`
  })
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
  tableStore: TableStore<Datatype> = new TableStore({ fieldDefs, records: []});

  /**
   * Demo showing how to update the table rows with the store's setter.
   */
  async firstUpdated() {
    setInterval(() => {
      const data: Array<Datatype> = [];
      for(let i = 0; i < 10; i++) {
        data.push(generateDatum());
      }
      this.tableStore.records = data;
    }, 2000);
  };

  render() {
    // The following are both valid ways to use the component
    return html`
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
