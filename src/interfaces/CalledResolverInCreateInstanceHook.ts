import CalledResolver from './CalledResolver';
import { ResolverCreateInstanceHookResult } from '../types/ResolverCreateInstanceHookResult';
import { Class } from 'typescript-class-types';

export default interface CalledResolverInCreateInstanceHook<T extends Class> extends CalledResolver<ResolverCreateInstanceHookResult<T>> {

}