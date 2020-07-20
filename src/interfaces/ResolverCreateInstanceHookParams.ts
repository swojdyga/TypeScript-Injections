import { Context } from '../types/Context';
import { AbstractClass } from 'typescript-class-types';

export default interface ResolverCreateInstanceHookParams<T extends object> {
    context: Context;
    constructor: AbstractClass<T>; 
}