import { html } from 'lit'
import { Directive, directive } from 'lit/directive.js';
import { get } from 'svelte/store';
import { TableStore } from './table-store';

/**
 * This class adds in the custom styles based on the store data for each table
 * 
 * TODO: need to add more custom styles so individual columns have classes
 */
class TableStyleDirective extends Directive {
  render(tableStore: TableStore<any>) {
    const fieldClasses = get(tableStore.getFields())
    const colGroupClasses = tableStore.colGroups.map((cg) => cg.class).filter((klass) => klass && klass != '');
    return html`<style>
    ${fieldClasses.map(
      (fieldClass) => `td.${fieldClass}, th.${fieldClass} {
        border-style: var(--${fieldClass}-border-style);
        min-width: var(--${fieldClass}-min-width);
        max-width: var(--${fieldClass}-max-width);
        width: var(--${fieldClass}-width);
        min-height: var(--${fieldClass}-min-height);
        height: var(--${fieldClass}-height);
      }`
    )}
    ${fieldClasses.map(
      (fieldClass) => `th.${fieldClass} {
        background-color: var(--${fieldClass}-background-color);
        text-align: var(--${fieldClass}-heading-text-align);
        vertical-align: var(--${fieldClass}-heading-vertical-align);
      }`
    )}
    ${fieldClasses.map(
      (fieldClass) => `td.${fieldClass} {
        background-color: var(--${fieldClass}-background-color);
        text-align: var(--${fieldClass}-cell-text-align);
      }`
    )}
    ${colGroupClasses.map(
      (colGroupClass) => `.${colGroupClass} { background-color: var(--${colGroupClass}-color); }`
    )}
    </style>`
  }
}

export const renderTableStyles = directive(TableStyleDirective);