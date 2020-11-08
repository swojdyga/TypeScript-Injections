import { Class } from 'typescript-class-types';
import { ResolvingElement } from '../../../../../../abstractions/Container/abstractions/Resoler/types/ResolvingElement';

export default interface SingletonizeCreateInstanceHookParams<R extends ResolvingElement, T extends Class> {
    resolvingElement: R;
    type: T;
}
