import { html } from 'lit'
import { Directive, directive } from 'lit/directive.js';
import { TableStore } from './table-store';

/**
 * This class adds in the custom styles based on the store data for each table.
 * It pushes the CSS into a dynamically created <style> tag in the component's
 * shadow DOM.
 */
class TableStyleDirective extends Directive {

  generateStyleString(tableStore: TableStore<any>) {
    const tableId = tableStore.tableId;
    const fields = tableStore.getFields();
    const colGroups = tableStore.colGroups.map((cg) => cg.class).filter((klass) => klass && klass != '');

    return `
    table {
      background-color: var(--table-${tableId}-background-color, transparent);
      width: var(--table-${tableId}-width, 100%);
      max-width: var(--table-${tableId}-max-width, 100%);
      height: var(--table-${tableId}-height, auto);
      max-height: var(--table-${tableId}-max-height, auto);
      margin: var(--table-${tableId}-margin, 0);
      display: var(--table-${tableId}-display, table);
      overflow-x: var(--table-${tableId}-overflow-x, hidden);
      overflow-y: var(--table-${tableId}-overflow-y, hidden);
      border-width: var(--table-${tableId}-border-width, 0px);
      border-color: var(--table-${tableId}-border-color, transparent);
      border-style: var(--table-${tableId}-border-style, solid);
      border-collapse: var(--table-${tableId}-border-collapse, separate);
      border-spacing: var(--table-${tableId}-border-spacing, 0px);
    }

    #${tableId} caption {
      background-color: var(--table-${tableId}-caption-background-color, var(--table-${tableId}-background-color, transparent));
      caption-side: var(--table-${tableId}-caption-side, bottom);
      text-align: var(--table-${tableId}-caption-align, left);
      margin: var(--table-${tableId}-caption-margin, 0);
      padding: var(--table-${tableId}-caption-padding, 0);
      border-width: var(--table-${tableId}-caption-border-width, 0);
      border-color: var(--table-${tableId}-caption-border-color, transparent);
      border-style: var(--table-${tableId}-caption-border-style, none);
    }

    #${tableId} th, #${tableId} td {
      padding: var(--table-${tableId}-element-padding, 0.33em);
    }

    #${tableId} thead {
      position: var(--table-${tableId}-header-position, static);
      top: var(--table-${tableId}-header-top, 0px);
    }

    #${tableId} thead th:first-child {
      background-color: var(--table-${tableId}-header-first-heading-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-header-first-heading-border-width, 0px);
      border-color: var(--table-${tableId}-header-first-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-header-first-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-header-first-heading-border-radius);
      min-height: var(--table-${tableId}-header-min-height);
      max-height: var(--table-${tableId}-header-max-height);
      height: var(--table-${tableId}-header-height);
    }

    #${tableId} thead th {
      background-color: var(--table-${tableId}-header-heading-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-header-heading-border-width, 0px);
      border-color: var(--table-${tableId}-header-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-header-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-header-heading-border-radius);
      min-height: var(--table-${tableId}-header-min-height);
      max-height: var(--table-${tableId}-header-max-height);
      height: var(--table-${tableId}-header-height);
    }

    #${tableId} thead th:last-child {
      background-color: var(--table-${tableId}-header-last-heading-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-header-last-heading-border-width, 0px);
      border-color: var(--table-${tableId}-header-last-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-header-last-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-header-last-heading-border-radius);
      min-height: var(--table-${tableId}-header-min-height);
      max-height: var(--table-${tableId}-header-max-height);
      height: var(--table-${tableId}-header-height);
    }

    #${tableId} tbody th:first-child {
      background-color: var(--table-${tableId}-body-first-heading-background-color, var(--table-${tableId}-body-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-body-first-heading-border-width, 0px);
      border-color: var(--table-${tableId}-body-first-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-first-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-first-heading-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody th {
      background-color: var(--table-${tableId}-body-heading-background-color, var(--table-${tableId}-background-color, transparent));
      border-width: var(--table-${tableId}-body-heading-border-width, 0px);
      border-color: var(--table-${tableId}-body-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-heading-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody th:last-child {
      background-color: var(--table-${tableId}-body-last-heading-background-color, var(--table-${tableId}-body-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-body-last-heading-border-width, 0px);
      border-color: var(--table-${tableId}-body-last-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-last-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-last-heading-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody td:first-child {
      background-color: var(--table-${tableId}-body-first-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-body-first-cell-border-width, 0px);
      border-color: var(--table-${tableId}-body-first-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-first-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-first-cell-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody td {
      background-color: var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color, transparent));
      border-width: var(--table-${tableId}-body-cell-border-width, 0px);
      border-color: var(--table-${tableId}-body-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-cell-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody td:last-child {
      background-color: var(--table-${tableId}-body-last-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-body-last-cell-border-width, 0px);
      border-color: var(--table-${tableId}-body-last-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-last-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-last-cell-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tfoot th:first-child {
      border-width: var(--table-${tableId}-footer-first-heading-border-width, var(--table-${tableId}-footer-heading-border-width, 0px));
      border-color: var(--table-${tableId}-footer-first-heading-border-color, var(--table-${tableId}-footer-heading-border-color, var(--table-${tableId}-border-color, transparent)));
      border-style: var(--table-${tableId}-footer-first-heading-border-style, var(--table-${tableId}-footer-heading-border-style, var(--table-${tableId}-border-style, solid)));
      border-radius: var(--table-${tableId}-footer-first-heading-border-radius, var(--table-${tableId}-footer-heading-border-radius));
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    #${tableId} tfoot th {
      border-width: var(--table-${tableId}-footer-heading-border-width, 0px);
      border-color: var(--table-${tableId}-footer-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-footer-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-footer-heading-border-radius);
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    #${tableId} tfoot th:last-child {
      border-width: var(--table-${tableId}-footer-last-heading-border-width, var(--table-${tableId}-footer-heading-border-width, 0px));
      border-color: var(--table-${tableId}-footer-last-heading-border-color, var(--table-${tableId}-footer-heading-border-color, var(--table-${tableId}-border-color, transparent)));
      border-style: var(--table-${tableId}-footer-last-heading-border-style, var(--table-${tableId}-footer-heading-border-style, var(--table-${tableId}-border-style, solid)));
      border-radius: var(--table-${tableId}-footer-last-heading-border-radius, var(--table-${tableId}-footer-heading-border-radius));
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    #${tableId} tfoot td:first-child {
      border-width: var(--table-${tableId}-footer-first-cell-border-width, var(--table-${tableId}-footer-cell-border-width, 0px));
      border-color: var(--table-${tableId}-footer-first-cell-border-color, var(--table-${tableId}-footer-cell-border-color, var(--table-${tableId}-border-color, transparent)));
      border-style: var(--table-${tableId}-footer-first-cell-border-style, var(--table-${tableId}-footer-cell-border-style, var(--table-${tableId}-border-style, solid)));
      border-radius: var(--table-${tableId}-footer-first-cell-border-radius, var(--table-${tableId}-footer-cell-border-radius));
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    #${tableId} tfoot td {
      border-width: var(--table-${tableId}-footer-cell-border-width, 0px);
      border-color: var(--table-${tableId}-footer-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-footer-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-footer-cell-border-radius);
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    #${tableId} tfoot td:last-child {
      border-width: var(--table-${tableId}-footer-last-cell-border-width, var(--table-${tableId}-footer-cell-border-width, 0px));
      border-color: var(--table-${tableId}-footer-last-cell-border-color, var(--table-${tableId}-footer-cell-border-color, var(--table-${tableId}-border-color, transparent)));
      border-style: var(--table-${tableId}-footer-last-cell-border-style, var(--table-${tableId}-footer-cell-border-style, var(--table-${tableId}-border-style, solid)));
      border-radius: var(--table-${tableId}-footer-last-cell-border-radius, var(--table-${tableId}-footer-cell-border-radius));
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    ${fields.map((field) => `
      #${tableId} tbody tr td.${field}:first-child, #${tableId} tbody tr td.${field}, #${tableId} tbody tr td.${field}:last-child, #${tableId} thead th.${field} {
        min-width: var(--table-${tableId}-${field}-min-width);
        max-width: var(--table-${tableId}-${field}-max-width);
        width: var(--table-${tableId}-${field}-width);
      }
      #${tableId} th.${field}, #${tableId} th.${field}:first-child, #${tableId} th.${field}:last-child {
        border-style: var(--table-${tableId}-${field}-heading-border-style, var(--table-${tableId}-${field}-border-style, var(--table-${tableId}-border-style, solid)));
        background-color: var(--table-${tableId}-${field}-heading-background-color, var(--table-${tableId}-${field}-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent))));
        text-align: var(--table-${tableId}-${field}-heading-text-align, var(--table-${tableId}-${field}-text-align, var(--table-text-align, center)));
        vertical-align: var(--table-${tableId}-${field}-heading-vertical-align, var(--table-${tableId}-${field}-vertical-align, var(--table-vertical-align, middle)));
      }
      #${tableId} tbody td.${field}, #${tableId} tbody td.${field}:first-child, #${tableId} tbody td.${field}:last-child {
        border-style: var(--table-${tableId}-${field}-cell-border-style, var(--table-${tableId}-${field}-border-style, var(--table-${tableId}-border-style, solid)));
        background-color: var(--table-${tableId}-${field}-cell-background-color, var(--table-${tableId}-${field}-background-color, var(--table-${tableId}-background-color, transparent)));
        text-align: var(--table-${tableId}-${field}-cell-text-align, var(--table-${tableId}-${field}-text-align, var(--table-text-align, center)));
        vertical-align: var(--table-${tableId}-${field}-cell-vertical-align, var(--table-${tableId}-${field}-vertical-align, var(--table-vertical-align, middle)));
      }
      #${tableId} tbody tr:nth-child(even) td, #${tableId} tbody tr:nth-child(even) td:first-child, #${tableId} tbody tr:nth-child(even) td:last-child {
        background-color: var(--table-${tableId}-${field}-row-even-background-color, var(--table-${tableId}-row-even-background-color, var(--table-${tableId}-${field}-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color)))));
      }
      #${tableId} tbody tr:nth-child(odd) td, #${tableId} tbody tr:nth-child(odd) td:first-child, #${tableId} tbody tr:nth-child(odd) td:last-child {
        background-color: var(--table-${tableId}-${field}-row-odd-background-color, var(--table-${tableId}-row-odd-background-color, var(--table-${tableId}-${field}-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color)))));
      }`
    ).join('\n')}

    ${colGroups.map(
      (colGroup) => `#${tableId} .${colGroup} { background-color: var(--table-${tableId}-${colGroup}-color, var(--table-${tableId}-background-color, transparent)); }`
    ).join('\n')}`
  }

  render(tableStore: TableStore<any>) {
    return html`<style>${this.generateStyleString(tableStore)}</style>`
  }
}

export const renderTableStyles = directive(TableStyleDirective);