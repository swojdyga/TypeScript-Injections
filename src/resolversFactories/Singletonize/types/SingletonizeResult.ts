import SingletonizeResolver from '../interfaces/SingletonizeResolver';
import Resolver from '../../../interfaces/Resolver';

export type SingletonizeResult<T> = Array<Resolver & SingletonizeResolver<T>>;