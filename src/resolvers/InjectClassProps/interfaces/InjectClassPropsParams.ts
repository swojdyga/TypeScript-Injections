import { Class } from "typescript-class-types";
import { ObjectParams } from "../types/ObjectParams";

export default interface InjectClassPropsParams<I> {
    in: Class<I>;
    props: ObjectParams<I>;
}