import { Context } from '../types/Context';
import { AbstractClass } from 'typescript-class-types';

export default interface ResolverCreateInstanceHook {
    createInstanceHook: <C extends Context, O extends object>(context: C, constructor: AbstractClass<O>) => O | void;
}
