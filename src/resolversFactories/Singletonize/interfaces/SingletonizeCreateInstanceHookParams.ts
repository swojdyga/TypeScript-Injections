import { AbstractClass } from 'typescript-class-types';
import Resolver from '../../../interfaces/Resolver';

export default interface SingletonizeCreateInstanceHookParams<T extends object> {
    constructor: AbstractClass<T>;
    calledResolversInCreateInstanceHook: Resolver[];
}