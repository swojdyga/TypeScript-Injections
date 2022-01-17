export default interface Class<
    T,
    A extends any[],
> {
    new (...args: A): T;
    prototype: T;
}
