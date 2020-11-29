import { ResolvingElement } from "../../../../../../abstractions/Container/abstractions/Resoler/types/ResolvingElement";

export default interface InjectInjectHookParams<R extends ResolvingElement> {
    resolvingElements: R[];
}