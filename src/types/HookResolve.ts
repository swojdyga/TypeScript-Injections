import { AbstractClass, Class } from 'typescript-class-types';
import ResolversCollection from '../interfaces/ResolversCollection';

export type HookResolve = <T extends AbstractClass | Class>(type: T, additionalResolvers?: Array<ResolversCollection>) => T extends AbstractClass<infer U> ? U : never;