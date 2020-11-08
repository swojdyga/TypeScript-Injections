import { AbstractClass, Class } from "typescript-class-types";
import Resolver from './abstractions/Resoler/Resolver';

export default abstract class Container {
    public abstract resolve<T extends AbstractClass | Class>(type: T, resolvers: Resolver[]): T extends AbstractClass<infer U> ? U : never;
}