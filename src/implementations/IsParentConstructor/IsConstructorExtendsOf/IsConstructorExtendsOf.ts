import { AbstractClass } from "typescript-class-types";
import IsParentConstructor from "../../../abstractions/IsParentConstructor/IsParentConstructor";

export default class IsConstructorExtendsOf implements IsParentConstructor {
    private readonly basePrototype = Object.getPrototypeOf(() => {});

    public isParent(constructorA: AbstractClass, constructorB: AbstractClass): boolean {
        if(constructorA === constructorB) {
            return true;
        }
    
        if(constructorA !== this.basePrototype) {
            return this.isParent(this.getParent(constructorA), constructorB);
        }
    
        return false;
    }

    private getParent(constructor: AbstractClass): AbstractClass {
        return Object.getPrototypeOf(constructor);
    }
}