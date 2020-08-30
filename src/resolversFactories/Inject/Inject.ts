import InjectParams from './interfaces/InjectParams';
import ResolverInjectHookParams from '../../interfaces/ResolverInjectHookParams';
import ResolverInjectHookResult from '../../interfaces/ResolverInjectHookResult';
import ResolversCollection from '../../interfaces/ResolversCollection';

export default function Inject<F extends object, T extends F>(config: InjectParams<F, T>): ResolversCollection {
    return [
        {
            hooks: {
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
        },
    ];
}