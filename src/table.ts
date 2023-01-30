import { LitElement, css, html, TemplateResult } from 'lit'
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context';
import { map } from 'lit/directives/map.js';
import { get } from 'svelte/store';
import { StoreSubscriber } from 'lit-svelte-stores';
import { FieldDefinitions } from './field-definitions';
import { TableStore, TableStoreContext } from './table-store';
import { renderTableStyles } from './table-style-directive';

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
    <colgroup>
      ${map(
        colGroups,
        (c) => html`<col span="${c.span}" class="${c.class}">`
      )}
    </colgroup>`;
  }

  /**
   * Render sorting indicators according to state
   */
  sortIndicator(fieldDefs: FieldDefinitions<any>, field: string) {
    const sortDirection = this.tableStore.sortDirection;
    const sortFragment = html`
    <svg style="display: inline; width:24px; height: 24px; transform: scale(0.6) translate(0%, +50%);">
      <use xlink:href="/all.svg#gg-select"/>
    </svg>`;
    if (fieldDefs[field].sort) {
      if (field == this.tableStore.sortField) {
        switch (sortDirection) {
          case 'na':
            break;
          case 'asc':
            return html`
            <svg style="display: inline; width:24px; height: 24px; transform: scale(0.6) translate(0%, +50%);">
              <use xlink:href="/all.svg#gg-chevron-up"/>
            </svg>`;
          case 'dsc':
            return html`
            <svg style="display: inline; width:24px; height: 24px; transform: scale(0.6) translate(0%, +50%);">
              <use xlink:href="/all.svg#gg-chevron-down"/>
            </svg>`;
        }
      }
      return sortFragment;
    }
    return html``;
  }

  /**
   * 
   */
  headerHandler(field: string) {
    return () => {
      if (this.tableStore.sortField == field) {
        if (this.tableStore.sortDirection == 'asc') {
          this.tableStore.sortDirection = 'dsc';
        } else if (this.tableStore.sortDirection == 'dsc') {
          this.tableStore.sortDirection = 'na';
          this.tableStore.sortField = '';
        }
      } else {
        this.tableStore.sortField = field;
        this.tableStore.sortDirection = 'asc';
      }
    }
  }

  /**
   * Render the heading for column, adding sorting controls if sort function is present
   *
   * Table behavior:
   * - clicking on sortable headings are stateful
   * - if new column selection, reset to 'asc' sort and set sortField
   * - if same column selected again, change to 'dsc'
   * - if same column selected thrice, change to 'na' and remove sortField
   */
  heading(field: string): TemplateResult {
    const fieldDefs = this.tableStore.fieldDefs;
    const heading = fieldDefs[field].heading;
    return html`
    <th @click=${this.headerHandler(field)} class="${field}">
      ${heading}
      ${this.sortIndicator(fieldDefs, field)}
    </th>`
  }

  /**
   * Render the header
   * TODO: make this header into a configurable function like the footer, that way more
   *   complicated headers with multiple rows of headings that may span colgroups
   *   can be added.
   */
  header(): TemplateResult {
    if (this.tableStore.showHeader) {
      const fields = get(this.tableStore.getFields());
      return html`
      <thead>
        <tr>
          ${map(
            fields,
            (field) => this.heading(field)
          )}
        </tr>
      </thead>`
    }
    return html``;
  }

  /**
   * Render a row
   */
  row(record: any, fields: string[]): TemplateResult {
    return html`
    <tr>
      ${map(
        fields,
        (field) => html`<td class="${field}">${this.tableStore.decorateField(field, record[field])}</td>`
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
      ${renderTableStyles(this.tableStore)}
      ${this.caption()}
      ${this.colGroup()}
      ${this.header()}
      ${this.body()}
      ${this.foot()}
    </table>`;
  }

  /**
   * Styles that don't change per component instance
   */
  static styles = [
    css`

  table {
    background-color: var(--table-background-color);
    width: var(--table-width);
    max-width: var(--table-max-width);
    height: var(--table-height);
    max-height: var(--table-max-height);
    margin: var(--table-margin);
    display: var(--table-display);
    overflow-x: var(--table-overflow-x);
    overflow-y: var(--table-overflow-y);
    border-width: var(--table-border-width);
    border-color: var(--table-border-color);
    border-style: var(--table-border-style);
    border-collapse: var(--table-border-collapse);
    border-spacing: var(--table-border-spacing);
  }

  caption {
    caption-side: var(--table-caption-side);
    text-align: var(--table-caption-align);
    margin: var(--table-caption-margin);
    padding: var(--table-caption-padding);
  }

  th, td {
    padding: var(--table-element-padding);
  }

  thead {
    position: var(--table-header-position);
    top: var(--table-header-top);
  }

  thead th:first-child {
    border-width: var(--table-header-first-heading-border-width);
    border-color: var(--table-header-first-heading-border-color);
    border-style: var(--table-header-first-heading-border-style);
    border-radius: var(--table-header-first-heading-border-radius);
  }

  thead th {
    border-width: var(--table-header-heading-border-width);
    border-color: var(--table-header-heading-border-color);
    border-style: var(--table-header-heading-border-style);
    border-radius: var(--table-header-heading-border-radius);
  }

  thead th:last-child {
    border-width: var(--table-header-last-heading-border-width);
    border-color: var(--table-header-last-heading-border-color);
    border-style: var(--table-header-last-heading-border-style);
    border-radius: var(--table-header-last-heading-border-radius);
  }

  tbody th {
    border-width: var(--table-body-heading-border-width);
    border-color: var(--table-body-heading-border-color);
    border-style: var(--table-body-heading-border-style);
    border-radius: var(--table-body-heading-border-radius);
  }

  tbody th:first-child {
    border-width: var(--table-body-first-heading-border-width);
    border-color: var(--table-body-first-heading-border-color);
    border-style: var(--table-body-first-heading-border-style);
    border-radius: var(--table-body-first-heading-border-radius);
  }

  tbody td:first-child {
    border-width: var(--table-body-first-cell-border-width);
    border-color: var(--table-body-first-cell-border-color);
    border-style: var(--table-body-first-cell-border-style);
    border-radius: var(--table-body-first-cell-border-radius);
  }

  tbody td {
    border-width: var(--table-body-cell-border-width);
    border-color: var(--table-body-cell-border-color);
    border-style: var(--table-body-cell-border-style);
    border-radius: var(--table-body-cell-border-radius);
  }

  tbody td:last-child {
    border-width: var(--table-body-last-cell-border-width);
    border-color: var(--table-body-last-cell-border-color);
    border-style: var(--table-body-last-cell-border-style);
    border-radius: var(--table-body-last-cell-border-radius);
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
  }

  tr:nth-child(even) td {
    background-color: var(--table-row-even-background-color);
  }

  tr:nth-child(odd) td {
      background-color: --table-row-odd-background-color;
  }
  `];
}
