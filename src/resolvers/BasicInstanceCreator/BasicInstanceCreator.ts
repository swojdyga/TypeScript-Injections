import { Class } from 'typescript-class-types';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import BasicInstanceCreatorCreateInstanceHookParams from './interfaces/BasicInstanceCreatorCreateInstanceHookParams';

export const BasicInstanceCreator = [
    {
        hooks: {
            createInstance<T extends object>(params: BasicInstanceCreatorCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                return {
                    //can't detect at runtime is it an abstract class :(
                    createdInstance: new (params.constructor as Class<T>)(),
                };
            },
        },
    },
];