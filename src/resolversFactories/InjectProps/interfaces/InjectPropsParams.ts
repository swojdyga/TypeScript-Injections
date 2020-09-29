import { AbstractClass } from "typescript-class-types";
import { OptionalObjectParams } from "../types/OptionalObjectParams";

export default interface InjectPropsParams<I> {
    type: AbstractClass<I>;
    props: OptionalObjectParams<I>;
}