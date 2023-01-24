import { createContext } from '@lit-labs/context';
import { FieldDefinitions, undefinedFunc } from "./field-definitions";

interface fieldDefsAndData {
  fieldDefs?: FieldDefinitions<any>
  data?: Array<Record<string, Object>>
}

export class TableStore implements fieldDefsAndData{
  fieldDefs: FieldDefinitions<any> = {};
  data: Array<Record<string, Object>> = [];

  constructor(init: fieldDefsAndData) {
    if (init.fieldDefs) this.fieldDefs = init.fieldDefs
    if (init.data) this.data = init.data
  }

  synthesizeFields(datum: Record<string, Object>) {
    const synthsizedDatum = { ...datum };
    for (let key in this.fieldDefs) {
      if (this.fieldDefs[key].synthesizer !== undefinedFunc) {
        synthsizedDatum[key] = this.fieldDefs[key].synthesizer(datum);
      }
    }
    return synthsizedDatum;
  }

  getHeadings() {
    if (this.fieldDefs) {
      return Object.values(this.fieldDefs);
    } else {
      return [];
    }
  }

  getFields() {
    if (this.fieldDefs) {
      return Object.keys(this.fieldDefs);
    } else {
      return [];
    }
  }

  getData() {
    if (this.data) {
      return this.data.map((datum) => this.synthesizeFields(datum));
    } else {
      return [];
    }
  }
}

export const TableStoreContext = createContext<TableStore>('adaburrows-table-store');
