type Synthesizer<T> = (data: T) => any;
type Decorator = (field: any) => any;
type Sort<T> = (a: T, b: T) => number;

export function undefinedFunc<T> (..._args: [T]) { return undefined }

export class FieldDefinition<T extends Object > {
  heading: String = '';
  synthesizer: Synthesizer<T> = undefinedFunc;
  decorator: Decorator = undefinedFunc;
  sort: Sort<T> = (..._args) => 0;

  constructor(
    heading: String,
    synthesizer?: Synthesizer<T>,
    decorator?: Decorator,
    sort?: Sort<T>)
  {
    this.heading = heading;
    if (synthesizer) { this.synthesizer = synthesizer }
    if (decorator) { this.decorator = decorator }
    if (sort) { this.sort = sort }
  }
}

export type FieldDefinitions<T extends {}> = Record<keyof T | string, FieldDefinition<T>>;