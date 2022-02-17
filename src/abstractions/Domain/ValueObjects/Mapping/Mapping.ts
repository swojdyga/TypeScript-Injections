import AbstractClass from "../../../Infrastructure/AbstractClass/AbstractClass";
import Class from "../../../Infrastructure/Class/Class";

export default class Mapping<T> {
    public constructor(
        public readonly config: {
            readonly abstraction: AbstractClass<T>,
            readonly implementation: Class<T, any[]>,
        },
    ) {

    }
}
