import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import { TableContextElement as BareTableContextElement } from './table-context-element';
import { Table as BareTable } from './table';

export { FieldDefinition, lexicographic, numeric } from './field-definitions'
export type { FieldDefinitions } from './field-definitions'
export { TableStore } from './table-store'
export { TableStoreContext } from './table-context'

export const Table = createComponent({
  tagName: 'adaburrows-table',
  elementClass: BareTable,
  react: React,
});

export const TableContextElement = createComponent({
  tagName: 'adaburrows-table',
  elementClass: BareTableContextElement,
  react: React,
});