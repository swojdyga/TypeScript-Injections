import { Class } from 'typescript-class-types';

export default interface InjectConstructorParamsBeforeCreateInstanceHookParams<T extends Class> {
    type: T;
    constructorParams: ConstructorParameters<T> | [];
}