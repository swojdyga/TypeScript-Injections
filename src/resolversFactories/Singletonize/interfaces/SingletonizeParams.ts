import { AbstractClass } from "typescript-class-types";

export default interface SingletonizeParams<I> {
    type: AbstractClass<I>;
}