import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class } from 'typescript-class-types';
import { ResolverBeforeCreateInstanceHookResult } from '../../types/ResolverBeforeCreateInstanceHookResult';
import InjectConstructorParamsBeforeCreateInstanceHookParams from './interfaces/InjectConstructorParamsBeforeCreateInstanceHookParams';

export default function InjectConstructorParams<I extends Class>(config: InjectConstructorParamsParams<I>) {
    return [
        {
            hooks: {
                beforeCreateInstance<T extends Class | I>(params: InjectConstructorParamsBeforeCreateInstanceHookParams<T>): ResolverBeforeCreateInstanceHookResult<T> {
                    if(params.constructor === config.type) {
                        return {
                            constructorParams: config.params as ConstructorParameters<T>,
                        };
                    }
                },
            },
        },
    ];
};