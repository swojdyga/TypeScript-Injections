import { Class } from 'typescript-class-types';

export default interface InjectConstructorParamsBeforeCreateInstanceHookParams<T extends Class> {
    constructor: T;
    constructorParams: ConstructorParameters<T> | [];
}