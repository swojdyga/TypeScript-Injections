import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class } from 'typescript-class-types';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import InjectConstructorParamsCreateInstanceHookParams from './interfaces/InjectConstructorParamsCreateInstanceHookParams';

export default function InjectConstructorParams<I extends object, L extends Class<I>>(config: InjectConstructorParamsParams<L>) {
    return [
        {
            hooks: {
                createInstance<T extends object | I>(params: InjectConstructorParamsCreateInstanceHookParams<T | I>): ResolverCreateInstanceHookResult<T> {
                    if(params.constructor === config.type) {
                        return {
                            createdInstance: (new config.type(...config.params)) as T,
                        };
                    }
                },
            },
        },
    ];
};