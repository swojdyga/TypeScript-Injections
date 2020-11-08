import { AbstractClass, Class } from 'typescript-class-types';
import Resolver from '../../Container/abstractions/Resoler/Resolver';

export type HookResolve = <T extends AbstractClass | Class>(type: T, additionalResolvers?: Resolver[]) => T extends AbstractClass<infer U> ? U : never;