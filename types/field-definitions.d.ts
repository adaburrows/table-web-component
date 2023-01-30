import { TemplateResult } from "lit";
/**
 * Function types
 */
type SynthesizerFunc<T> = (data: T) => any;
type DecoratorFunc = (field: any) => TemplateResult;
type SortFunc = (a: any, b: any) => number;
/**
 * Convenience object for passing params
 */
interface FieldDefinitionProps<T> {
    heading: string;
    synthesizer?: SynthesizerFunc<T>;
    decorator?: DecoratorFunc;
    sort?: SortFunc;
}
/**
 * Defines the required data for a column
 */
export declare class FieldDefinition<T extends object> implements FieldDefinitionProps<T> {
    heading: string;
    synthesizer?: SynthesizerFunc<T>;
    decorator?: DecoratorFunc;
    sort?: SortFunc;
    constructor(init: FieldDefinitionProps<T>);
}
export type FieldDefinitions<T extends object> = Record<keyof T | string, FieldDefinition<T>>;
export declare const lexicographic: SortFunc;
export declare const numeric: SortFunc;
export {};
