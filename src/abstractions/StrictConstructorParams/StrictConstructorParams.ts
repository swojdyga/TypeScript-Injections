import { Class } from 'typescript-class-types';
import ConstructorParamArguments from '../ConstructorParams/interfaces/ConstructorParamArguments';
import { ArrayOfMethods } from './types/ArrayOfMethods';

export default interface StrictConstructorParams<C extends Class> {
    type: C;
    params: ArrayOfMethods<ConstructorParameters<C>, [params: ConstructorParamArguments]>;
}