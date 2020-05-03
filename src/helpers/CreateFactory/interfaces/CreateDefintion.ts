import { Class } from "typescript-class-types";

export default interface CreateDefintion<L extends Class<{}>> {
    constructor: L;
    constructorParams?: L extends Class<{}, infer A> ? A : never;
}