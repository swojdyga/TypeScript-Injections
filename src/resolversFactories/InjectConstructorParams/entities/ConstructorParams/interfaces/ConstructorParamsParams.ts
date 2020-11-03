import { Class } from 'typescript-class-types';
import ConstructorParamArguments from '../../../interfaces/ConstructorParamArguments';
import { ArrayOfMethods } from '../../../types/ArrayOfMethods';

export default interface ConstructorParamsParams<C extends Class> {
    type: C;
    params: ArrayOfMethods<ConstructorParameters<C>, [params: ConstructorParamArguments]>;
}