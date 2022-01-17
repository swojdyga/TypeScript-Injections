import AbstractClass from "../../../Infrastructure/AbstractClass/AbstractClass";
import Class from "../../../Infrastructure/Class/Class";

export default class Mapping<P extends {}, C extends AbstractClass<P>> {
    public constructor(
        public readonly config: {
            readonly abstraction: C,
            readonly implementation: Class<P, any[]>,
            readonly singleton?: true,
        },
    ) {

    }
}
