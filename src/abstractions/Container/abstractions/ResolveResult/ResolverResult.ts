import { AbstractClass } from "typescript-class-types";

export default abstract class ResolverResult<T> {
    public abstract instance: T extends AbstractClass<infer U> ? U : never;
}