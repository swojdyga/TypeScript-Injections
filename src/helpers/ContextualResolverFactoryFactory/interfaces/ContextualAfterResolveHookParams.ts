import { Context } from '../../../types/Context';

export default interface ContextualAfterResolveHookParams<T extends object> {
    context: Context;
    object: T;
}