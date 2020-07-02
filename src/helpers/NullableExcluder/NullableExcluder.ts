export default function NullableExcluder<T extends unknown>(values: Array<T>): Array<NonNullable<T>> {
    return values.filter((element) => {
        return element !== undefined && element !== null;
    }) as Array<NonNullable<T>>;
}