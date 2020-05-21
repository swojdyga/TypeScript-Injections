import { Context } from '../../types/Context';
import { AbstractClass, Class } from 'typescript-class-types';
import ResolverCreateInstanceHook from '../../interfaces/ResolverCreateInstanceHook';

export const BasicInstanceCreator: ResolverCreateInstanceHook = {
    createInstanceHook<C extends Context, O>(context: C, constructor: AbstractClass<O>): O | void {
        //can't detect at runtime is it an abstract class :(
        return new (constructor as Class<O>)();
    },
};