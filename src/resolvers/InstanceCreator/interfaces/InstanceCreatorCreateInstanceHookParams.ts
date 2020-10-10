import { Class } from 'typescript-class-types';

export default interface InstanceCreatorCreateInstanceHookParams<T extends Class<{}, any[]>> {
    constructor: T;
    constructorParams: ConstructorParameters<T>;
}