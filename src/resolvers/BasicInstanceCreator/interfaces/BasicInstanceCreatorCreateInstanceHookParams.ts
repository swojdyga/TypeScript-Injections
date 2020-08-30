import { AbstractClass } from 'typescript-class-types';

export default interface BasicInstanceCreatorCreateInstanceHookParams<T extends object> {
    constructor: AbstractClass<T>;
}