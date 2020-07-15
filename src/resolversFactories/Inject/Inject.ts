import { Context } from '../../types/Context';
import InjectParams from './interfaces/InjectParams';
import ResolverInjectHook from '../../interfaces/ResolverInjectHook';

export default function Inject<F, T extends F>(params: InjectParams<F, T>): ResolverInjectHook {
    return {
        injectHook<C extends Context, O extends object | F, R extends O | T>(context: C, object: O): R | void {
            if(params.type === object) {
                return params.to as R;
            }
        },
    }
}