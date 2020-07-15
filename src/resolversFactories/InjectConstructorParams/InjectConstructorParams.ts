import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class, AbstractClass } from 'typescript-class-types';
import { Context } from '../../types/Context';
import ResolverCreateInstanceHook from '../../interfaces/ResolverCreateInstanceHook';

export default function InjectConstructorParams<L extends Class>(params: InjectConstructorParamsParams<L>): ResolverCreateInstanceHook {
    return {
        createInstanceHook<C extends Context, O extends object>(context: C, constructor: AbstractClass<O> | L): O | void {
            if(constructor === params.type) {
                return new params.type(...params.params) as O;
            }
        }
    };
};