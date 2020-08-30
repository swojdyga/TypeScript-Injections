import Resolver from "../../../interfaces/Resolver";

export default interface SingletonizeAfterResolveHookParams<T extends object> {
    object: T;
    calledResolversInAfterResolveHook: Resolver[];
}