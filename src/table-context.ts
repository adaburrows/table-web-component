
import { TableStore } from './table-store';
import { createContext } from '@lit-labs/context';

export const TableStoreContext = createContext<TableStore<any>>('adaburrows-table-store');