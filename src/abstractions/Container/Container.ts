import { AbstractClass, Class } from "typescript-class-types";
import Resolver from './abstractions/Resoler/Resolver';
import ResolverResult from './abstractions/ResolveResult/ResolverResult';

export default abstract class Container {
    public abstract resolve<T extends AbstractClass | Class>(type: T, resolvers: Resolver[]): ResolverResult<T>;
}