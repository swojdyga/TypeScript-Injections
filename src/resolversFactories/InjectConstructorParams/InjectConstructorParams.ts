import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class } from 'typescript-class-types';
import { ResolverBeforeCreateInstanceHookResult } from '../../types/ResolverBeforeCreateInstanceHookResult';
import InjectConstructorParamsBeforeCreateInstanceHookParams from './interfaces/InjectConstructorParamsBeforeCreateInstanceHookParams';
import InjectConstructorParamsParamsParamsParamParams from './interfaces/InjectConstructorParamsParamsParamsParamParams';

export default function InjectConstructorParams<I extends Class>(config: InjectConstructorParamsParams<I>) {
    return {
        process: () => ({
            hooks: {
                beforeCreateInstance<T extends Class | I>(params: InjectConstructorParamsBeforeCreateInstanceHookParams<T>): ResolverBeforeCreateInstanceHookResult<T> {
                    if(params.type === config.type) {
                        return {
                            constructorParams: config.params
                                .map((param: (params: InjectConstructorParamsParamsParamsParamParams) => keyof ConstructorParameters<T>) => {
                                    return param({
                                        resolve: params.resolve,
                                    });
                                }) as ConstructorParameters<T>,
                        };
                    }
                },
            },
        }),
    };
};