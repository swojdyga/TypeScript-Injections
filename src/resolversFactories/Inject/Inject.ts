import { Context } from '../../types/Context';
import InjectParams from './interfaces/InjectParams';
import ResolverInjectHook from '../../interfaces/ResolverInjectHook';

export default function InjectClass<F, T extends F>(params: InjectParams<F, T>): ResolverInjectHook {
    return {
        injectHook<C extends Context, O extends {} | F, R extends O | T>(context: C, object: O): R | void {
            if(params.from === object) {
                return params.to as R;
            }
        },
    }
}