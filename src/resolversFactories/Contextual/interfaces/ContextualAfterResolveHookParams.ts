import { Context } from '../../../types/Context';
import ContextualResolverParams from './ContextualResolverParams';
import { ResolvingElement } from '../../../types/ResolvingElement';

export default interface ContextualAfterResolveHookParams<R extends ResolvingElement, T extends object> extends ContextualResolverParams<R> {
    object: T;
}