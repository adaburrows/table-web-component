import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { LitElement, css, html } from 'lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context';
import { TableStore, TableStoreContext } from './table-store';
import { map } from 'lit/directives/map.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class Table extends ScopedRegistryHost(LitElement) {

  @consume({context: TableStoreContext, subscribe: true})
  @property({type: Object})
  public tableStore!: TableStore;

  render() {
    const headings = this.tableStore.getHeadings().map((fieldDef) => fieldDef.heading);
    const fields = this.tableStore?.getFields();
    const data = this.tableStore.getData();
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
        ${map(data, (row) => html`
        <tr>
          ${
            //TODO: wrap in decorators
            // @ts-ignore
            map(fields, (field) => html`<td>${row[field]}</td>`)
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
