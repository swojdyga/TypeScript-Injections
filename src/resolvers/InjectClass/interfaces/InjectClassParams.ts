import { Class } from "typescript-class-types";

export default interface InjectClassParams<I> {
    from: Class<I>;
    to: Class<I>;
}