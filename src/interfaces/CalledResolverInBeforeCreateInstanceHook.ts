import CalledResolver from './CalledResolver';
import { ResolverBeforeCreateInstanceHookResult } from '../types/ResolverBeforeCreateInstanceHookResult';
import { Class } from 'typescript-class-types';

export default interface CalledResolverInBeforeCreateInstanceHook<T extends Class> extends CalledResolver<ResolverBeforeCreateInstanceHookResult<T>> {

}