import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { TableContext } from './table-context-element';
import { TableStore } from './table-store';
import { Table } from './table';
import { FieldDefinitions, FieldDefinition } from './field-definitions';

interface Datatype {
  id: string
  name: string
  description: string
  age: number
}

const fieldDefs: FieldDefinitions<Datatype> = {
  'id': new FieldDefinition<Datatype>('ID'),
  'name': new FieldDefinition<Datatype>('Name'),
  'description': new FieldDefinition<Datatype>('Desc.'),
  'age': new FieldDefinition<Datatype>('Age (in months)'),
  'synth': new FieldDefinition<Datatype>(
    'Age + 12',
    (data: Datatype) => data.age + 12
  )
}

/**
 * To test the component
 */
@customElement('table-test')
export class TableTest extends ScopedRegistryHost(LitElement) {
  static elementDefinitions = {
    'adaburrows-table-context': TableContext,
    'adaburrows-table': Table,
  }

  @state()
  tableStore: TableStore = new TableStore({ fieldDefs, data: []});

  constructor() {
    super();
  }

  async firstUpdated() {
    setInterval(() => {
      const data = this.tableStore.data;
      data.push({
        'id': btoa("" + Math.random() * 300000000000),
        'name': btoa("" + Math.random() * 300000000000),
        'description': btoa("" + Math.random() * 300000000000),
        'age': Math.random() * 120
      });
      this.tableStore = new TableStore({ fieldDefs, data });
    }, 1000);
  };

  render() {
    return html`
      <adaburrows-table-context .store=${this.tableStore}>
        <adaburrows-table></adaburrows-table>
      </adaburrows-table-context>
    `
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'table-test': TableTest
  }
}
