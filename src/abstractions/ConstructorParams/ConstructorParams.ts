import { Class } from 'typescript-class-types';
import ConstructorParamArguments from './interfaces/ConstructorParamArguments';

export default interface ConstructorParams {
    type: Class;
    params: Array<(params: ConstructorParamArguments) => unknown>;
}