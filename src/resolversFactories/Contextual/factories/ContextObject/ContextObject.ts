import ContextualParamsContext from '../../interfaces/ContextualParamsContext';
import { Context } from '../../../../types/Context';
import { ResolvingElement } from '../../../../types/ResolvingElement';

export default function ContextObject(object: object): ContextualParamsContext {
    return {
        isInExpectedContext: (context: Context) => context === object,
        isExpectedResolvingElement: (resolvingElement: ResolvingElement) => resolvingElement === object,
    };
}