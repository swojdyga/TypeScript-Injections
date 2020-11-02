import { Class } from 'typescript-class-types';
import { ResolverCreateInstanceHookResult } from '../../types/ResolverCreateInstanceHookResult';
import InstanceCreatorCreateInstanceHookParams from './interfaces/InstanceCreatorCreateInstanceHookParams';

export const InstanceCreator = {
    process: () => ({
        hooks: {
            createInstance<T extends Class>(params: InstanceCreatorCreateInstanceHookParams<T>): ResolverCreateInstanceHookResult<T> {
                return {
                    //can't detect at runtime is it an abstract class :(
                    createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                };
            },
        },
    }),
};