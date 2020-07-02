export default function ArrayOfObjectsKeyValue<T, K extends keyof T>(objects: Array<T>, key: K) {
    return objects.map((element) => {
        return element[key];
    });
}
