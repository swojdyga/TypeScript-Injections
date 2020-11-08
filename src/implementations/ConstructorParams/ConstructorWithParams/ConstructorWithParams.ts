import { Class } from 'typescript-class-types';
import ConstructorParams from '../../../abstractions/ConstructorParams/ConstructorParams';
import ConstructorParamArguments from '../../../abstractions/ConstructorParams/interfaces/ConstructorParamArguments';
import StrictConstructorParams from '../../../abstractions/StrictConstructorParams/StrictConstructorParams';

export default class ConstructorWithParams<C extends Class> implements ConstructorParams {
    public readonly type: Class;
    public readonly params: Array<(params: ConstructorParamArguments) => unknown>;

    public constructor(params: StrictConstructorParams<C>) {
        this.type = params.type;
        this.params = params.params;
    }
}