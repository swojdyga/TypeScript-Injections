import { Context } from '../types/Context';
import { Class } from 'typescript-class-types';

export default interface ResolverCreateInstanceHook {
    createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A>): O | void;
}