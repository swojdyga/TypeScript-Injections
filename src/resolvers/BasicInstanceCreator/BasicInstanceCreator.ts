import { Class } from 'typescript-class-types';
import ResolverCreateInstanceHook from '../../interfaces/ResolverCreateInstanceHook';
import ResolverCreateInstanceHookParams from '../../interfaces/ResolverCreateInstanceHookParams';
import ResolverCreateInstanceHookResult from '../../interfaces/ResolverCreateInstanceHookResult';

export const BasicInstanceCreator: ResolverCreateInstanceHook = {
    createInstanceHook<T extends object>(params: ResolverCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
        return {
            //can't detect at runtime is it an abstract class :(
            createdInstance: new (params.constructor as Class<T>)(),
        };
    },
};