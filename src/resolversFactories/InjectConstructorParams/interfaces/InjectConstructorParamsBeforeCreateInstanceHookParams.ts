import { Class } from 'typescript-class-types';
import { HookResolve } from '../../../types/HookResolve';

export default interface InjectConstructorParamsBeforeCreateInstanceHookParams<T extends Class> {
    resolve: HookResolve,
    type: T;
    constructorParams: ConstructorParameters<T> | [];
}