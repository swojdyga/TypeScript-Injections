import { AbstractClass } from "typescript-class-types";

export default abstract class ResolveResultFactoryConfig<T> {
    public abstract readonly instance: T extends AbstractClass<infer U> ? U : never;
}