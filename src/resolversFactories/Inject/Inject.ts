import InjectParams from './interfaces/InjectParams';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import InjectInjectHookParams from './interfaces/InjectInjectHookParams';
import { AbstractClass, Class } from 'typescript-class-types';

export default function Inject<I extends object, F extends Class<I> | AbstractClass<I>, T extends Class<I>>(config: InjectParams<F, T>) {
    return [
        {
            process: () => ({
                hooks: {
                    inject<T extends object | F>(params: InjectInjectHookParams<T>): ResolverInjectHookResult<T> {
                        if(config.type === params.object) {
                            return {
                                injectedObject: config.to as unknown as T,
                            };
                        }
                    },
                },
            })
        },
    ];
}