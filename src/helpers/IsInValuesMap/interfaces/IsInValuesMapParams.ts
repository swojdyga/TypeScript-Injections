import ValuesMap from './ValuesMap';
import { IsCorrectValue } from '../types/IsCorrectValue';

export default interface IsInValuesMapParams<T extends object> {
    valuesMap: ValuesMap<T>,
    value: T,
    isCorrectValue: IsCorrectValue,
}