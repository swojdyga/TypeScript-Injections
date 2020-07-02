import { Context } from '../types/Context';
import { AbstractClass } from 'typescript-class-types';

export default interface ResolverCreateInstanceHook {
    createInstanceHook: <C extends Context, O>(context: C, constructor: AbstractClass<O>) => O | void;
}