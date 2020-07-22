import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class } from 'typescript-class-types';
import ResolverCreateInstanceHook from '../../interfaces/ResolverCreateInstanceHook';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';

export default function InjectConstructorParams<I extends object, L extends Class<I>>(config: InjectConstructorParamsParams<L>): ResolverCreateInstanceHook {
    return {
        createInstanceHook<T extends object | I>(params: ResolverCreateInstanceHookParams<T | I>): ResolverCreateInstanceHookResult<T> {
            if(params.constructor === config.type) {
                return {
                    createdInstance: (new config.type(...config.params)) as T,
                };
            }

            return {

            };
        }
    };
};