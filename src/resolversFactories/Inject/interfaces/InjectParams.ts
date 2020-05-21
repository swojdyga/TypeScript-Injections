export default interface InjectParams<F, T extends F> {
    from: F;
    to: T;
}