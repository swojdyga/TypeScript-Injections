import { Class } from 'typescript-class-types';
import { HookResolve } from '../../../../../../abstractions/Container/abstractions/Resoler/types/HookResolve';

export default interface InjectConstructorParamsBeforeCreateInstanceHookParams<T extends Class> {
    resolve: HookResolve,
    type: T;
    constructorParams: ConstructorParameters<T> | [];
}