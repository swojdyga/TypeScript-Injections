import { Class } from 'typescript-class-types';
import ConstructorParamArguments from '../ConstructorParams/interfaces/ConstructorParamArguments';
import { ArrayOfMethods } from './types/ArrayOfMethods';

export default abstract class StrictConstructorParams<C extends Class> {
    public abstract readonly type: C;
    public abstract readonly params: ArrayOfMethods<ConstructorParameters<C>, [params: ConstructorParamArguments]>;
}