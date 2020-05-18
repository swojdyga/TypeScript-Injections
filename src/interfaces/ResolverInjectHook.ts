import { Context } from '../types/Context';

export default interface ResolverInjectHook {
    injectHook<C extends Context, O, R extends O>(context: C, object: O): R | void;
}