import { LitElement, html, TemplateResult } from 'lit';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { property } from 'lit/decorators.js'
import { consume } from '@lit-labs/context';
import { map } from 'lit/directives/map.js';
import { StoreSubscriber } from 'lit-svelte-stores';
import { FieldDefinitions, TemplateValue } from './field-definitions';
import { RowValue, TableStore } from './table-store';
import { TableStoreContext } from './table-context';
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
    return html`
    <colgroup>
      ${map(
        this.tableStore.colGroups,
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
    <svg style="display: inline; width:24px; height: 24px; transform: translate(0%, +30%);">
      <path
        d="M9.17154 11.508L7.75732 10.0938L12 5.85114L16.2426 10.0938L14.8284 11.508L12 8.67956L9.17154 11.508Z"
        fill="currentColor" />
      <path
        d="M9.17154 12.492L7.75732 13.9062L12 18.1489L16.2426 13.9062L14.8284 12.492L12 15.3204L9.17154 12.492Z"
        fill="currentColor" />
    </svg>`;
    if (fieldDefs[field].sort) {
      if (field == this.tableStore.sortField) {
        switch (sortDirection) {
          case 'na':
            break;
          case 'asc':
            return html`
            <svg style="display: inline; width:24px; height: 24px; transform: translate(0%, +30%);">
              <path
                d="M14.8285 14.8284L16.2427 13.4142L12.0001 9.17161L7.75745 13.4142L9.17166 14.8285L12.0001 12L14.8285 14.8284Z"
                fill="currentColor" />
            </svg>`;
          case 'desc':
            return html`
            <svg style="display: inline; width:24px; height: 24px; transform: translate(0%, +30%);">
              <path
                d="M7.75745 10.5858L9.17166 9.17154L12.0001 12L14.8285 9.17157L16.2427 10.5858L12.0001 14.8284L7.75745 10.5858Z"
                fill="currentColor" />
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
          this.tableStore.sortDirection = 'desc';
        } else if (this.tableStore.sortDirection == 'desc') {
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
   * - if same column selected again, change to 'desc'
   * - if same column selected thrice, change to 'na' and remove sortField
   */
  sortingDecorator(heading: TemplateValue, field: string, fieldDefs: FieldDefinitions<any>): TemplateResult {
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
      const fieldDefs = this.tableStore.fieldDefs;
      return html`
      <thead>
        <tr>
          ${map(this.tableStore.getHeadings(), (rowValue) => {
            const {field, value} = rowValue;
            return this.sortingDecorator(value, field, fieldDefs);
          })}
        </tr>
      </thead>`
    }
    return html``;
  }

  /**
   * Render the rows in the body.
   */
  body(): TemplateResult {
    return html`
    <tbody>
      ${map(this.tableStore.getRows(), (row) => html`
        <tr>
          ${map(row, (rowValue: RowValue) => {
            const {field, value} = rowValue;
            return html`<td class="${field}">${value}</td>`
          })}
        </tr>`
      )}
    </tbody>`;
  }

  /**
   * Render the footer.
   */
  foot(): TemplateResult {
    if (this.tableStore.footerFunction && typeof this.tableStore.footerFunction == 'function') {
      const footerCells = this.tableStore.footerFunction(this.tableStore.getRecords());
      return html`<tfoot>${footerCells}</tfoot>`;
    } else {
      return html``;
    }
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
