import { Class } from 'typescript-class-types';
import { InjectConstructorParamsParamsParams } from './InjectConstructorParamsParamsParams';
import InjectConstructorParamsParamsParamsParamParams from './InjectConstructorParamsParamsParamsParamParams';

export default class InjectConstructorParamsParams<C extends Class> {
    type: C;
    params: InjectConstructorParamsParamsParams<ConstructorParameters<C>, [params: InjectConstructorParamsParamsParamsParamParams]>;
}