import { Class } from "typescript-class-types";
import { ObjectParams } from "../types/ObjectParams";

export default interface InjectPropsParams<I> {
    in: Class<I>;
    props: ObjectParams<I>;
}