import { AbstractClass } from 'typescript-class-types';
import { BasePrototype } from './consts/BasePrototype';

export default function IsConstructorExtendsOf(constructor: AbstractClass, baseConstructor: AbstractClass): boolean {
    if(constructor === baseConstructor) {
        return true;
    }

    if(constructor !== BasePrototype) {
        return IsConstructorExtendsOf(Object.getPrototypeOf(constructor), baseConstructor);
    }

    return false;
}