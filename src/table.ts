import { LitElement, html, TemplateResult } from 'lit'
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
    ${renderTableStyles(this.tableStore)}
    <table id="${this.tableStore.tableId}">
      ${this.caption()}
      ${this.colGroup()}
      ${this.header()}
      ${this.body()}
      ${this.foot()}
    </table>`;
  }
}
