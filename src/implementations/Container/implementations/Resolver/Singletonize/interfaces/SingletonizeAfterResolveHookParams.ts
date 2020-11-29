import CalledResolverInAfterResolveHook from "../../../../../../abstractions/Container/abstractions/Resoler/interfaces/CalledResolverInAfterResolveHook";
import { ResolvingElement } from "../../../../../../abstractions/Container/abstractions/Resoler/types/ResolvingElement";

export default interface SingletonizeAfterResolveHookParams<R extends ResolvingElement, T extends object> {
    resolvingElements: R[];
    object: T;
    calledResolversInAfterResolveHook: CalledResolverInAfterResolveHook<R>[];
}
