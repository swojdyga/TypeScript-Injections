import { Class } from 'typescript-class-types';

export default interface InstanceCreatorCreateInstanceHookParams<T extends Class<{}, any[]>> {
    type: T;
    constructorParams: ConstructorParameters<T>;
}