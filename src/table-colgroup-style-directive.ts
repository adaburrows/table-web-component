import { html } from 'lit'
import { Directive, directive } from 'lit/directive.js';
import { ColGroup } from './table-store';

class ColGroupStyleDirective extends Directive {
  render(colGroups: ColGroup[]) {
    const classes = colGroups.map((cg) => cg.class).filter((klass) => klass && klass != '');
    return html`<style>
    ${classes.map(
      (klass) => `.${klass} { background-color: var(--${klass}-color); }`
    )}
    </style>`
  }
}

export const renderColGroupStyles = directive(ColGroupStyleDirective);