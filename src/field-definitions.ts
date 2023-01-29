import { TemplateResult } from "lit";

type SynthesizerFunc<T> = (data: T) => any;
type DecoratorFunc = (field: any) => TemplateResult;
type SortFunc = (a: any, b: any) => number;

interface FieldDefinitionProps<T> {
  heading: string;
  synthesizer?: SynthesizerFunc<T>;
  decorator?: DecoratorFunc;
  sort?: SortFunc;
}

export class FieldDefinition<T extends object> implements FieldDefinitionProps<T> {
  heading: string = '';
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
