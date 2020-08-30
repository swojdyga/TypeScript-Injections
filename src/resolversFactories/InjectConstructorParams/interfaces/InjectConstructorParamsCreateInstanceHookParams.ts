import { AbstractClass } from 'typescript-class-types';

export default interface InjectConstructorParamsCreateInstanceHookParams<T extends object> {
    constructor: AbstractClass<T>;

}