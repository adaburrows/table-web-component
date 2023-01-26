import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { LitElement, css, html } from 'lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context';
import { TableStore, TableStoreContext } from './table-store';
import { map } from 'lit/directives/map.js';
import { get } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';

/**
 * Table component that supports creating synthetic fields, decorating fields
 * with components, setting up colgroups, and sorting.
 */
export class Table extends ScopedRegistryHost(LitElement) {
  public storeSubscriber: StoreSubscriber<{}>;

  /**
   * This property can either be provided directly, or can be provided by a context
   */
  @consume({context: TableStoreContext, subscribe: true})
  @property({type: Object})
  public tableStore!: TableStore<any>;

  constructor() {
    super();

    // Set up lit-svelte-stores controller
    this.storeSubscriber = new StoreSubscriber(this, () => this.tableStore);
  }

  /**
   * Renders the table based on current data and table state
   */
  render() {
    const headings = get(this.tableStore.getHeadings());
    const fields = get(this.tableStore.getFields());
    const records = get(this.tableStore.getRecords());
    return html`
    <table>
      <caption></caption>
      <colgroup>
        <!-- Need to add colgroup support -->
      </colgroup>
      <thead>
        <tr>
          ${map(headings, (h) => html`<th>${h}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${map(records, (record) => html`
        <tr>
          ${
            map(fields, (field) => html`<td>${this.tableStore.decorateField(field, record[field])}</td>`)
          }
        </tr>
        `)}
      </tbody>
      <tfoot>
      </tfoot>
    </table>
    `
  }

  static styles = css`
  `
}
