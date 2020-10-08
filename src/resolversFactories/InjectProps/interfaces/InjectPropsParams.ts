import { AbstractClass } from "typescript-class-types";
import { OptionalObjectParams } from "../types/OptionalObjectParams";
import { InjectPropsParamsParams } from './InjectPropsParamsParams';

export default interface InjectPropsParams<I> {
    type: AbstractClass<I>;
    props: OptionalObjectParams<InjectPropsParamsParams<I>>;
}