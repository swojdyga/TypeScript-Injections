import InjectParams from './interfaces/InjectParams';
import { ResolverInjectHookResult } from '../../types/ResolverInjectHookResult';
import InjectInjectHookParams from './interfaces/InjectInjectHookParams';

export default function Inject<F extends object, T extends F>(config: InjectParams<F, T>) {
    return [
        {
            hooks: {
                inject<T extends object | F>(params: InjectInjectHookParams<T>): ResolverInjectHookResult<T> {
                    if(config.type === params.object) {
                        return {
                            injectedObject: config.to as unknown as T,
                        };
                    }
                },
            },
        },
    ];
}