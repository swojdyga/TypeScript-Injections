import { Class } from 'typescript-class-types';

export default class InjectConstructorParamsParams<C extends Class> {
    type: C;
    params: ConstructorParameters<C>;
}