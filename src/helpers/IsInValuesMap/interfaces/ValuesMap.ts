export default interface ValuesMap<T extends object> {
    get(key: T): T | undefined;
}