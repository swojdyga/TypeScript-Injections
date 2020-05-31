export default interface InjectParams<F, T extends F> {
    type: F;
    to: T;
}