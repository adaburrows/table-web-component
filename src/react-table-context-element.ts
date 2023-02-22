import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import { TableContextElement as BareTableContextElement } from './table-context-element';

export const TableContextElement = createComponent({
  tagName: 'adaburrows-table',
  elementClass: BareTableContextElement,
  react: React,
});