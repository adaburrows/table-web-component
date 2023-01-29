import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { LitElement, css, html } from 'lit'
import { property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context';
import { TableStore, TableStoreContext } from './table-store';
import { map } from 'lit/directives/map.js';
import { get } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
import { FieldDefinitions } from './field-definitions';

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
   * Render the caption
   */
  caption() {
    const caption = this.tableStore.caption;
    if (caption && caption != '') {
      return html`<caption>${caption}</caption>`
    }
    return html``;
  }

  /**
   * Render the <colgroup> and <col>s.
   */
  colGroup() {
    const colGroups = this.tableStore.colGroups;
    return html`
    <colgroup>
      ${map(
        colGroups,
        (c) => html`<col span="${c.span}" class="${c.class}">`
      )}
    </colgroup>`;
  }

  /**
   * Render the heading for column, adding sorting controls if sort function is present
   */
  heading(fieldDefs: FieldDefinitions<any>, field: string) {
    const heading = fieldDefs[field].heading;
    if (fieldDefs[field] && fieldDefs[field].sort) {
      // decorate with sorting controls
      console.log('should wrap in sorting control')
    }
    return html`<th>${heading}</th>`
  }

  /**
   * Render the header
   */
  header() {
    const fieldDefs = this.tableStore.fieldDefs;
    const fields = get(this.tableStore.getFields());
    return html`
    <thead>
      <tr>
        ${map(
          fields,
          (field) => this.heading(fieldDefs, field)
        )}
      </tr>
    </thead>`;
  }

  /**
   * Render a row
   */
  row(record: any, fields: string[]) {
    return html`
    <tr>
      ${map(
        fields,
        (field) => html`<td>${this.tableStore.decorateField(field, record[field])}</td>`
      )}
    </tr>`;
  }

  /**
   * Render the rows in the body.
   */
  body() {
    const fields = get(this.tableStore.getFields());
    const records = get(this.tableStore.getRecords());
    return html`
    <tbody>
      ${map(
        records,
        (record) => html`${this.row(record, fields)}`
      )}
    </tbody>`;
  }

  /**
   * Render the footer.
   * TODO: need to implement footer template logic.
   */
  foot() {
    html`
    <tfoot>
    </tfoot>`;
  }

  /**
   * Renders the table based on current data and table state
   */
  render() {
    return html`
    <table>
      ${this.caption()}
      ${this.colGroup()}
      ${this.header()}
      ${this.body()}
      ${this.foot()}
    </table>`;
  }

  static styles = css`
  table {
    border-width: var(--table-border-width);
    border-color: var(--table-border-color);
    border-style: var(--table-border-style);
    border-collapse: var(--table-border-collapse);
    border-spacing: var(--table-border-spacing);
  }

  th {
    border-width: var(--table-cell-border-width);
    border-color: var(--table-cell-border-color);
    border-style: var(--table-cell-border-style);
    border-radius: var(--table-cell-border-radius);
  }

  td {
    border-width: var(--table-cell-border-width);
    border-color: var(--table-cell-border-color);
    border-style: var(--table-cell-border-style);
    border-radius: var(--table-cell-border-radius);
  }
  `
}
