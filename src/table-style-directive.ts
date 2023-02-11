import { html } from 'lit'
import { Directive, directive } from 'lit/directive.js';
import { get } from 'svelte/store';
import { TableStore } from './table-store';

/**
 * This class adds in the custom styles based on the store data for each table.
 * It pushes the CSS into a dynamically created <style> tag in the component's
 * shadow DOM.
 */
class TableStyleDirective extends Directive {

    /*

    Heights of rows
    --table-${tableId}-header-min-height
    --table-${tableId}-header-max-height
    --table-${tableId}-header-height
    --table-${tableId}-body-cell-min-height
    --table-${tableId}-body-cell-max-height
    --table-${tableId}-body-cell-height
    --table-${tableId}-footer-min-height
    --table-${tableId}-footer-max-height
    --table-${tableId}-footer-height

    Background colors (least to most specific)
    --table-${tableId}-background-color
    --table-${tableId}-heading-background-color
    --table-${tableId}-header-first-heading-background-color
    --table-${tableId}-header-heading-background-color
    --table-${tableId}-header-last-heading-background-color
    --table-${tableId}-body-first-cell-background-color
    --table-${tableId}-body-cell-background-color
    --table-${tableId}-body-last-cell-background-color
    --table-${tableId}-${fieldClass}-background-color
    --table-${tableId}-${fieldClass}-heading-background-color
    --table-${tableId}-${fieldClass}-cell-background-color
    --table-${tableId}-row-even-background-color
    --table-${tableId}-row-odd-background-color
    --table-${tableId}-${fieldClass}-row-even-background-color
    --table-${tableId}-${fieldClass}-row-odd-background-color

    Caption background colors (least to most specific)
    transparent
    --table-${tableId}-background-color
    --table-${tableId}-caption-background-color

    Header background colors (least to most specific)
    transparent
    --table-${tableId}-background-color
    --table-${tableId}-heading-background-color
    --table-${tableId}-${fieldClass}-background-color
    --table-${tableId}-${fieldClass}-heading-background-color

    Text align (least to most specific)
    --table-text-align
    --table-${tableId}-${fieldClass}-text-align
    --table-${tableId}-${fieldClass}-heading-text-align
    --table-${tableId}-${fieldClass}-cell-text-align

    Vertical align (least to most specific)
    --table-vertical-align
    --table-${tableId}-${fieldClass}-vertical-align
    --table-${tableId}-${fieldClass}-heading-vertical-align
    --table-${tableId}-${fieldClass}-cell-vertical-align

    */

  generateStyleString(tableStore: TableStore<any>) {
    const tableId = tableStore.tableId;
    const fieldClasses = get(tableStore.getFields());
    const colGroupClasses = tableStore.colGroups.map((cg) => cg.class).filter((klass) => klass && klass != '');

    return `
    table {
      background-color: var(--table-${tableId}-background-color, transparent);
      width: var(--table-${tableId}-width);
      max-width: var(--table-${tableId}-max-width);
      height: var(--table-${tableId}-height);
      max-height: var(--table-${tableId}-max-height);
      margin: var(--table-${tableId}-margin);
      display: var(--table-${tableId}-display, table);
      overflow-x: var(--table-${tableId}-overflow-x);
      overflow-y: var(--table-${tableId}-overflow-y);
      border-width: var(--table-${tableId}-border-width);
      border-color: var(--table-${tableId}-border-color);
      border-style: var(--table-${tableId}-border-style);
      border-collapse: var(--table-${tableId}-border-collapse);
      border-spacing: var(--table-${tableId}-border-spacing);
    }

    #${tableId} caption {
      background-color: var(--table-${tableId}-caption-background-color, var(--table-${tableId}-background-color, transparent));
      caption-side: var(--table-${tableId}-caption-side);
      text-align: var(--table-${tableId}-caption-align);
      margin: var(--table-${tableId}-caption-margin);
      padding: var(--table-${tableId}-caption-padding);
    }

    #${tableId} th, #${tableId} td {
      padding: var(--table-${tableId}-element-padding);
    }

    #${tableId} thead {
      position: var(--table-${tableId}-header-position);
      top: var(--table-${tableId}-header-top);
    }

    #${tableId} thead th:first-child {
      background-color: var(--table-${tableId}-header-first-heading-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-header-first-heading-border-width, var(--table-${tableId}-border-width, 0px));
      border-color: var(--table-${tableId}-header-first-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-header-first-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-header-first-heading-border-radius);
      min-height: var(--table-${tableId}-header-min-height);
      max-height: var(--table-${tableId}-header-max-height);
      height: var(--table-${tableId}-header-height);
    }

    #${tableId} thead th {
      background-color: var(--table-${tableId}-header-heading-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-header-heading-border-width, var(--table-${tableId}-border-width, 0px));
      border-color: var(--table-${tableId}-header-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-header-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-header-heading-border-radius);
      min-height: var(--table-${tableId}-header-min-height);
      max-height: var(--table-${tableId}-header-max-height);
      height: var(--table-${tableId}-header-height);
    }

    #${tableId} thead th:last-child {
      background-color: var(--table-${tableId}-header-last-heading-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-header-last-heading-border-width, var(--table-${tableId}-border-width, 0px));
      border-color: var(--table-${tableId}-header-last-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-header-last-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-header-last-heading-border-radius);
      min-height: var(--table-${tableId}-header-min-height);
      max-height: var(--table-${tableId}-header-max-height);
      height: var(--table-${tableId}-header-height);
    }

    #${tableId} tbody th {
      background-color: var(--table-${tableId}-body-heading-background-color, var(--table-${tableId}-background-color, transparent));
      border-width: var(--table-${tableId}-body-heading-border-width, var(--table-${tableId}-border-width, 0px));
      border-color: var(--table-${tableId}-body-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-heading-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody th:first-child {
      background-color: var(--table-${tableId}-body-first-heading-background-color, var(--table-${tableId}-body-heading-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-body-first-heading-border-width, var(--table-${tableId}-border-width, 0px));
      border-color: var(--table-${tableId}-body-first-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-first-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-first-heading-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody td:first-child {
      background-color: var(--table-${tableId}-body-first-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-body-first-cell-border-width, var(--table-${tableId}-border-width, 0px));
      border-color: var(--table-${tableId}-body-first-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-first-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-first-cell-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody td {
      background-color: var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color, transparent));
      border-width: var(--table-${tableId}-body-cell-border-width);
      border-color: var(--table-${tableId}-body-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-cell-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tbody td:last-child {
      background-color: var(--table-${tableId}-body-last-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color, transparent)));
      border-width: var(--table-${tableId}-body-last-cell-border-width);
      border-color: var(--table-${tableId}-body-last-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-body-last-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-body-last-cell-border-radius);
      min-height: var(--table-${tableId}-cell-min-height);
      max-height: var(--table-${tableId}-cell-max-height);
      height: var(--table-${tableId}-cell-height);
    }

    #${tableId} tfoot th {
      border-width: var(--table-${tableId}-footer-heading-border-width);
      border-color: var(--table-${tableId}-footer-heading-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-footer-heading-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-footer-heading-border-radius);
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    #${tableId} tfoot td {
      border-width: var(--table-${tableId}-footer-cell-border-width);
      border-color: var(--table-${tableId}-footer-cell-border-color, var(--table-${tableId}-border-color, transparent));
      border-style: var(--table-${tableId}-footer-cell-border-style, var(--table-${tableId}-border-style, solid));
      border-radius: var(--table-${tableId}-footer-cell-border-radius);
      min-height: var(--table-${tableId}-footer-min-height);
      max-height: var(--table-${tableId}-footer-max-height);
      height: var(--table-${tableId}-footer-height);
    }

    ${fieldClasses.map((fieldClass) => `
      #${tableId} tbody tr td.${fieldClass}:first-child, #${tableId} tbody tr td.${fieldClass}, #${tableId} tbody tr td.${fieldClass}:last-child, #${tableId} thead th.${fieldClass} {
        min-width: var(--table-${tableId}-${fieldClass}-min-width);
        max-width: var(--table-${tableId}-${fieldClass}-max-width);
        width: var(--table-${tableId}-${fieldClass}-width);
      }
      #${tableId} th.${fieldClass}, #${tableId} th.${fieldClass}:first-child, #${tableId} th.${fieldClass}:last-child {
        border-style: var(--table-${tableId}-${fieldClass}-heading-border-style, var(--table-${tableId}-${fieldClass}-border-style, var(--table-${tableId}-border-style, solid)));
        background-color: var(--table-${tableId}-${fieldClass}-heading-background-color, var(--table-${tableId}-${fieldClass}-background-color, var(--table-${tableId}-heading-background-color, var(--table-${tableId}-background-color, transparent))));
        text-align: var(--table-${tableId}-${fieldClass}-heading-text-align, var(--table-${tableId}-${fieldClass}-text-align, var(--table-text-align, center)));
        vertical-align: var(--table-${tableId}-${fieldClass}-heading-vertical-align, var(--table-${tableId}-${fieldClass}-vertical-align, var(--table-vertical-align, middle)));
      }
      #${tableId} tbody td.${fieldClass}, #${tableId} tbody td.${fieldClass}:first-child, #${tableId} tbody td.${fieldClass}:last-child {
        border-style: var(--table-${tableId}-${fieldClass}-cell-border-style, var(--table-${tableId}-${fieldClass}-border-style, var(--table-${tableId}-border-style, solid)));
        background-color: var(--table-${tableId}-${fieldClass}-cell-background-color, var(--table-${tableId}-${fieldClass}-background-color, var(--table-${tableId}-background-color, transparent)));
        text-align: var(--table-${tableId}-${fieldClass}-cell-text-align, var(--table-${tableId}-${fieldClass}-text-align, var(--table-text-align, center)));
        vertical-align: var(--table-${tableId}-${fieldClass}-cell-vertical-align, var(--table-${tableId}-${fieldClass}-vertical-align, var(--table-vertical-align, middle)));
      }
      #${tableId} tbody tr:nth-child(even) td, #${tableId} tbody tr:nth-child(even) td:first-child, #${tableId} tbody tr:nth-child(even) td:last-child {
        background-color: var(--table-${tableId}-${fieldClass}-row-even-background-color, var(--table-${tableId}-row-even-background-color, var(--${tableId}-${fieldClass}-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color)))));
      }
      #${tableId} tbody tr:nth-child(odd) td, #${tableId} tbody tr:nth-child(odd) td:first-child, #${tableId} tbody tr:nth-child(odd) td:last-child {
        background-color: var(--table-${tableId}-${fieldClass}-row-odd-background-color, var(--table-${tableId}-row-odd-background-color, var(--${tableId}-${fieldClass}-cell-background-color, var(--table-${tableId}-body-cell-background-color, var(--table-${tableId}-background-color)))));
      }`
    ).join('\n')}

    ${colGroupClasses.map(
      (colGroupClass) => `#${tableId} .${colGroupClass} { background-color: var(--table-${tableId}-${colGroupClass}-color); }`
    ).join('\n')}`
  }

  render(tableStore: TableStore<any>) {
    return html`<style>${this.generateStyleString(tableStore)}</style>`
  }
}

export const renderTableStyles = directive(TableStyleDirective);