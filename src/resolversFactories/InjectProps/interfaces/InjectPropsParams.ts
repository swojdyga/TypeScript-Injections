import { AbstractClass } from "typescript-class-types";
import { InjectPropsParamsParams } from './InjectPropsParamsParams';

export default interface InjectPropsParams<I> {
    type: AbstractClass<I>;
    props: Partial<InjectPropsParamsParams<I>>;
}