import { Class } from "typescript-class-types";
import { OptionalObjectParams } from "../types/OptionalObjectParams";

export default interface InjectPropsParams<I> {
    type: Class<I>;
    props: OptionalObjectParams<I>;
}