import { css, html, LitElement } from 'lit';
import { provide } from '@lit-labs/context';
import { property } from 'lit/decorators.js';
import { TableStore } from './table-store';
import { TableStoreContext } from './table-context';

/**
 * create react wrapper with instructions on how to wire it up
 */

/**
 * TableContextElement for wiring up a TableStore without having to pass it down through
 * a bunch of other component props. Mostly useful for tables that are decorated
 * in a nest of other components.
 */
export class TableContextElement extends LitElement {

  @provide({ context: TableStoreContext })
  @property({ type: Object })
  public store!: TableStore<any>;

  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;
}
