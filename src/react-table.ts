import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import { Table as BareTable } from './table';

export const Table = createComponent({
  tagName: 'adaburrows-table',
  elementClass: BareTable,
  react: React,
});