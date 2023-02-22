/**
 * Types
 */
export type TemplateValue = unknown;
export type RowFunc<T> = ((data: T[]) => TemplateValue) | TemplateValue;
export type DecoratorFunc = (field: any) => TemplateValue;
export type SynthesizerFunc<T> = (data: T) => any;
export type SortFunc = (a: any, b: any) => number;

/**
 * Convenience object for passing params
 */
export interface FieldDefinitionProps<T> {
  heading: TemplateValue;
  synthesizer?: SynthesizerFunc<T>;
  decorator?: DecoratorFunc;
  sort?: SortFunc;
}

/**
 * Defines the required data for a column
 */
export class FieldDefinition<T extends object> implements FieldDefinitionProps<T> {
  heading: TemplateValue = '';
  synthesizer?: SynthesizerFunc<T>;
  decorator?: DecoratorFunc;
  sort?: SortFunc;

  constructor(init: FieldDefinitionProps<T>) {
    this.heading = init.heading;
    if (init.synthesizer) this.synthesizer = init.synthesizer
    if (init.decorator) this.decorator = init.decorator
    if (init.sort) this.sort = init.sort
  }
}

export type FieldDefinitions<T extends object> = Record<keyof T | string, FieldDefinition<T>>;

// Sorting functions

export const lexicographic: SortFunc = (a: string, b: string): number => {
  if (a < b ) return -1;
  if (b < a ) return 1;
  return 0;
};

export const numeric: SortFunc = (a: number, b: number) => a - b;
