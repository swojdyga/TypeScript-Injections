import { AbstractClass, Class } from 'typescript-class-types';
import Resolver from '../interfaces/Resolver';

export type HookResolve = <T extends AbstractClass | Class>(type: T, additionalResolvers?: Resolver[]) => T extends AbstractClass<infer U> ? U : never;