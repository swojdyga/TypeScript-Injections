import { AbstractClass } from 'typescript-class-types';
import ContextualParamsContext from '../../interfaces/ContextualParamsContext';
import { Context } from '../../../../types/Context';
import { ResolvingElement } from '../../../../types/ResolvingElement';
import IsConstructor from '../../../../helpers/IsConstructor/IsConstructor';
import IsConstructorExtendsOf from '../../../../helpers/IsConstructorExtendsOf/IsConstructorExtendsOf';

export default function ContextType(type: AbstractClass<object>): ContextualParamsContext {
    return {
        isInExpectedContext: (context: Context) => type instanceof Function && context instanceof type,
        isExpectedResolvingElement: (resolvingElement: ResolvingElement) => IsConstructor(resolvingElement) && IsConstructorExtendsOf(resolvingElement, type),
    };
}