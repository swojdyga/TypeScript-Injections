import { Context } from "../../../types/Context";
import { ResolvingElement } from '../../../types/ResolvingElement';

export default interface ContextualResolverParams<R extends ResolvingElement> {
    context: Context;
    resolvingElement: R;
}