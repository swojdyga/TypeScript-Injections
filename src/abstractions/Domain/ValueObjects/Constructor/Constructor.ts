import Class from "../../../Infrastructure/Class/Class";
import { ConstructorParams } from "../../../Infrastructure/ConstructorParams/ConstructorParams";

export default class Constructor<C extends Class<{}, any[]>> {
    public constructor(
        public readonly config: {
            readonly class: C,
            readonly params: () => ConstructorParams<C>,
        },
    ) {

    }
}