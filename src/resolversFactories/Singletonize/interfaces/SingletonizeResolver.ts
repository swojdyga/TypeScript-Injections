import SingletonizeParams from "./SingletonizeParams";

export default interface SingletonizeResolver<T> {
    resolverIdentity: Symbol;
    resolverParams: SingletonizeParams<T>;
}