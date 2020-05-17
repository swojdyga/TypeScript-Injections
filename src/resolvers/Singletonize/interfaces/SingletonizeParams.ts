import { Class } from "typescript-class-types";

export default interface SingletonizeParams<I> {
    type: Class<I>;
}