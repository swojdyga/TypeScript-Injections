import { Class } from 'typescript-class-types';
import ConstructorParamArguments from './ConstructorParamArguments';

export default interface InjectConstructorParamsParams {
    type: Class;
    params: Array<(params: ConstructorParamArguments) => unknown>;
}