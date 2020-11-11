import { Class } from 'typescript-class-types';
import ConstructorParamArguments from './interfaces/ConstructorParamArguments';

export default abstract class ConstructorParams {
    public abstract readonly type: Class;
    public abstract readonly params: Array<(params: ConstructorParamArguments) => unknown>;
}