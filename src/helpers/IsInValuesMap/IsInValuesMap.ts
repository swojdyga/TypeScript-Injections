import IsInValuesMapParams from "./interfaces/IsInValuesMapParams";

export default function IsInValuesMap<T extends object>(params: IsInValuesMapParams<T>): boolean {
    if(params.compareCallback(params.value, params.searchValue)) {
        return true;
    }

    const parentValue = params.valuesMap.get(params.value);
    if(parentValue) {
        return IsInValuesMap({
            ...params,
            value: parentValue,
        });
    }

    return false;
}