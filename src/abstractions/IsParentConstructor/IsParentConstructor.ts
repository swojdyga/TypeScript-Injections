import { AbstractClass } from "typescript-class-types";

export default abstract class IsParentConstructor {
    public abstract isParent(constructorA: AbstractClass, constructorB: AbstractClass): boolean;
}