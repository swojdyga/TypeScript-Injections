import { Class } from 'typescript-class-types';
import { InjectConstructorParamsParamsParams } from './InjectConstructorParamsParamsParams';
import InjectConstructorParamsParamsParamsParamParams from './InjectConstructorParamsParamsParamsParamParams';

export default interface InjectConstructorParamsParams<C extends Class> {
    type: C;
    params: InjectConstructorParamsParamsParams<ConstructorParameters<C>, [params: InjectConstructorParamsParamsParamsParamParams]>;
}