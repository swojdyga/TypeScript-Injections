import { AbstractClass } from "typescript-class-types";
import ResolverResult from "../../../../../abstractions/Container/abstractions/ResolveResult/ResolverResult";

export default class ResolveResultViaConfig<T> implements ResolverResult<T> {
    public instance: T extends AbstractClass<infer U> ? U : never;

    public constructor(config: ResolverResult<T>) {
        this.instance = config.instance;
    }
}