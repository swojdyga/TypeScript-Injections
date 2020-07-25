import ValuesMap from './ValuesMap';
import { CompareCallback } from '../types/CompareCallback';

export default interface IsInValuesMapParams<T extends object> {
    valuesMap: ValuesMap<T>,
    searchValue: T,
    value: T,
    compareCallback: CompareCallback,
}