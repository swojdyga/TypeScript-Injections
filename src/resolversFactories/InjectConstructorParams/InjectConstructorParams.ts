import InjectConstructorParamsParams from './interfaces/InjectConstructorParamsParams';
import { Class } from 'typescript-class-types';
import { ResolverBeforeCreateInstanceHookResult } from '../../types/ResolverBeforeCreateInstanceHookResult';
import InjectConstructorParamsBeforeCreateInstanceHookParams from './interfaces/InjectConstructorParamsBeforeCreateInstanceHookParams';
import ConstructorParamArguments from './interfaces/ConstructorParamArguments';

export default function InjectConstructorParams<I extends Class>(config: InjectConstructorParamsParams[]) {
    const constructorParamsMap = new Map<Class, ConstructorParameters<Class>>();

    config.forEach(({type, params}) => {
        constructorParamsMap.set(type, params);
    });

    return {
        process: () => ({
            hooks: {
                beforeCreateInstance<T extends Class | I>(params: InjectConstructorParamsBeforeCreateInstanceHookParams<T>): ResolverBeforeCreateInstanceHookResult<T> {
                    if(!constructorParamsMap.has(params.type)) {
                        return;
                    }
                    
                    return {
                        constructorParams: (constructorParamsMap.get(params.type) as ConstructorParameters<T>)
                            .map((param: (params: ConstructorParamArguments) => keyof ConstructorParameters<T>) => {
                                return param({
                                    resolve: params.resolve,
                                });
                            }) as ConstructorParameters<T>,
                    };
                },
            },
        }),
    };
};