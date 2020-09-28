import { Context } from '../../../types/Context';
import { ResolvingElement } from '../../../types/ResolvingElement';

export default interface ContextualParamsContext {
    isInExpectedContext: (context: Context) => boolean;
    isExpectedResolvingElement: (resolvingElement: ResolvingElement) => boolean;
}