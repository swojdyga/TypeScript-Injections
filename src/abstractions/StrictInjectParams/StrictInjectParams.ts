import { AbstractClass } from "typescript-class-types";

export default abstract class StrictInjectParams<F, T extends F> {
    public abstract type: AbstractClass<F>;
    public abstract to: AbstractClass<T>;
}