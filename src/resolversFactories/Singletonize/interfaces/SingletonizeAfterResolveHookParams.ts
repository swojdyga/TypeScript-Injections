import CalledResolverInAfterResolveHook from '../../../interfaces/CalledResolverInAfterResolveHook';
import { ResolvingElement } from '../../../types/ResolvingElement';

export default interface SingletonizeAfterResolveHookParams<R extends ResolvingElement, T extends object> {
    resolvingElement: R;
    object: T;
    calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<T>[];
}
