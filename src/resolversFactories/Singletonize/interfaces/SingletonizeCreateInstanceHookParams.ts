import { Class } from 'typescript-class-types';
import { ResolvingElement } from '../../../types/ResolvingElement';

export default interface SingletonizeCreateInstanceHookParams<R extends ResolvingElement, T extends Class> {
    resolvingElement: R;
    type: T;
}
