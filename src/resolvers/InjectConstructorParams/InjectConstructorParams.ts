import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class } from 'typescript-class-types';
import { Context } from '../../types/Context';

export default function InjectConstructorParams<L extends Class>(params: InjectConstructorParamsParams<L>) {
    return {
        createInstanceHook<C extends Context, O, A extends unknown[]>(context: C, constructor: Class<O, A> | L): O | void {
            if(constructor === params.type) {
                return new params.type(...params.params) as O;
            }
        }
    };
};