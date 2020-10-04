import { Class } from 'typescript-class-types';
import Resolver from '../../../interfaces/Resolver';

export default interface SingletonizeCreateInstanceHookParams<T extends Class> {
    constructor: T;
    calledResolversInCreateInstanceHook: Resolver[];
}