import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class } from 'typescript-class-types';
import { ResolverBeforeCreateInstanceHookResult } from '../../types/ResolverBeforeCreateInstanceHookResult';
import InjectConstructorParamsBeforeCreateInstanceHookParams from './interfaces/InjectConstructorParamsBeforeCreateInstanceHookParams';
import InjectConstructorParamsParamsParamsParamParams from './interfaces/InjectConstructorParamsParamsParamsParamParams';

export default function InjectConstructorParams<I extends Class>(config: InjectConstructorParamsParams<I>) {
    return [
        {
            hooks: {
                beforeCreateInstance<T extends Class | I>(params: InjectConstructorParamsBeforeCreateInstanceHookParams<T>): ResolverBeforeCreateInstanceHookResult<T> {
                    if(params.constructor === config.type) {
                        return {
                            constructorParams: config.params
                                .map((param: (params: InjectConstructorParamsParamsParamsParamParams) => keyof ConstructorParameters<T>) => {
                                    return param({
                                        context: params.constructor,
                                    });
                                }) as ConstructorParameters<T>,
                        };
                    }
                },
            },
        },
    ];
};