import { ResolvingElement } from '../types/ResolvingElement';

export default interface ResolverHookParams<R extends ResolvingElement> {
    resolvingElement: R;
}