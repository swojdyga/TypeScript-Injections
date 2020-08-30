import { Resolver } from '../../../types/Resolver';
import SingletonizeResolver from '../interfaces/SingletonizeResolver';

export type SingletonizeResult<T> = Resolver & Array<SingletonizeResolver<T>>;