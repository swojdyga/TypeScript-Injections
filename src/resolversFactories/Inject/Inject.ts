import InjectParams from './interfaces/InjectParams';
import ResolverInjectHook from '../../interfaces/ResolverInjectHook';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';

export default function Inject<F extends object, T extends F>(config: InjectParams<F, T>): ResolverInjectHook {
    return {
        injectHook<T extends object | F>(params: ResolverInjectHookParams<T>): ResolverInjectHookResult<T> {
            if(config.type === params.object) {
                return {
                    injectedObject: config.to as unknown as T,
                };
            }

            return {

            };
        },
    }
}