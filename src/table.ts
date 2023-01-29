import { LitElement, css, html, TemplateResult } from 'lit'
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context';
import { map } from 'lit/directives/map.js';
import { get } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
import { FieldDefinitions } from './field-definitions';
import { TableStore, TableStoreContext } from './table-store';
import { renderColGroupStyles } from './table-colgroup-style-directive';

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
  caption(): TemplateResult {
    const caption = this.tableStore.caption;
    if (caption && caption != '') {
      return html`<caption>${caption}</caption>`
    }
    return html``;
  }

  /**
   * Render the <colgroup> and <col>s.
   */
  colGroup(): TemplateResult {
    const colGroups = this.tableStore.colGroups;
    return html`
    ${renderColGroupStyles(colGroups)}
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
  heading(fieldDefs: FieldDefinitions<any>, field: string): TemplateResult {
    const heading = fieldDefs[field].heading;
    if (fieldDefs[field] && fieldDefs[field].sort) {
      // decorate with sorting controls
      console.log('should wrap in sorting control')
    }
    return html`<th>${heading}</th>`
  }

  /**
   * Render the header
   * TODO: make logic to disable header
   * TODO: make the into a configurable function like the footer, that way more
   *   complicated headers with multiple rows of headings that may span colgroups
   *   can be added.
   */
  header(): TemplateResult {
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
  row(record: any, fields: string[]): TemplateResult {
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
  body(): TemplateResult {
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
   */
  foot(): TemplateResult {
    const footerCells = this.tableStore.footerFunction(get(this.tableStore.getRecords()));
    return html`<tfoot>${footerCells}</tfoot>`;
  }

  /**
   * Renders the table based on current data and table state
   */
  render(): TemplateResult {
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

  thead th {
    border-width: var(--table-header-heading-border-width);
    border-color: var(--table-header-heading-border-color);
    border-style: var(--table-header-heading-border-style);
    border-radius: var(--table-header-heading-border-radius);
  }

  tbody th {
    border-width: var(--table-body-heading-border-width);
    border-color: var(--table-body-heading-border-color);
    border-style: var(--table-body-heading-border-style);
    border-radius: var(--table-body-heading-border-radius);
  }

  tbody td {
    border-width: var(--table-body-cell-border-width);
    border-color: var(--table-body-cell-border-color);
    border-style: var(--table-body-cell-border-style);
    border-radius: var(--table-body-cell-border-radius);
  }

  tfoot th {
    border-width: var(--table-footer-heading-border-width);
    border-color: var(--table-footer-heading-border-color);
    border-style: var(--table-footer-heading-border-style);
    border-radius: var(--table-footer-heading-border-radius);
  }

  tfoot td {
    border-width: var(--table-footer-cell-border-width);
    border-color: var(--table-footer-cell-border-color);
    border-style: var(--table-footer-cell-border-style);
    border-radius: var(--table-footer-cell-border-radius);
  }`
}
