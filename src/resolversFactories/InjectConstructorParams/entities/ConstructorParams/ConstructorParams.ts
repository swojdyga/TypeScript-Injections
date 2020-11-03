import { Class } from 'typescript-class-types';
import ConstructorParamsParams from './interfaces/ConstructorParamsParams';
import { ArrayOfMethods } from '../../types/ArrayOfMethods';
import ConstructorParamArguments from '../../interfaces/ConstructorParamArguments';
import InjectConstructorParamsParams from '../../interfaces/InjectConstructorParamsParams';

export default class ConstructorParams<C extends Class> implements InjectConstructorParamsParams {
    public readonly type: C;
    public readonly params: ArrayOfMethods<ConstructorParameters<C>, [params: ConstructorParamArguments]>;

    public constructor(params: ConstructorParamsParams<C>) {
        this.type = params.type;
        this.params = params.params;
    }
}