import { css, html, LitElement } from 'lit';
import { provide } from '@lit-labs/context';
import { property } from 'lit/decorators.js';
import { TableStore, TableStoreContext } from './table-store';

/*
This is the scoped component

I need to make a default global version that uses 
customElements.define('scoped-component', ScopedComponent);
to make these globally accessible

Also write about the versions of lit and open-wc/scoped-components vs @lit-labs/scoped-registry-mixin

create react wrapper with instructions on how to wire it up
determine if their needs to be an intermediary store subscriber that updates the context or if a readable can be passed through
*/

export class TableContext extends LitElement {

  @provide({ context: TableStoreContext })
  @property({ type: Object })
  public store!: TableStore;

  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;
}