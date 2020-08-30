import InjectParams from './interfaces/InjectParams';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';
import { Resolver } from '../../types/Resolver';

export default function Inject<F extends object, T extends F>(config: InjectParams<F, T>): Resolver {
    return [
        {
            injectHook<T extends object | F>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
                if(config.type === params.object) {
                    return {
                        injectedObject: config.to as unknown as T,
                    };
                }
    
                return {
    
                };
            },
        },
    ];
}