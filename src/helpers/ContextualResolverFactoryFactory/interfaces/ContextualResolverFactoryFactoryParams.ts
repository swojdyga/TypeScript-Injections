import { Context } from '../../../types/Context';
import { ResolvingElement } from '../../../types/ResolvingElement';

export default interface ContextualResolverFactoryFactoryParams {
    contextsCompare: (contextA: Context, contextB: Context) => boolean;
    resolvingElementToContextCompare: (resolvingElement: ResolvingElement, context: Context) => boolean;
}