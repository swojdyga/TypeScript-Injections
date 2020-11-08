import { Class } from 'typescript-class-types';

export default interface ResolverBeforeCreateInstanceHookResolveResult<T extends Class> {
    constructorParams?: ConstructorParameters<T>;
}