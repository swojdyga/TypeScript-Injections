import AbstractClass from "../../../Infrastructure/AbstractClass/AbstractClass";
import Class from "../../../Infrastructure/Class/Class";
import { ConstructorParams } from "../../../Infrastructure/ConstructorParams/ConstructorParams";
import TypeScriptInjectionsConfig from "../../DTO/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";

export default class Constructor<C extends Class<{}, any[]>> {
    public constructor(
        public readonly config: {
            readonly class: C,
            readonly params: (injections: {
                resolve: <T>(
                    abstraction: AbstractClass<T>,
                    config?: TypeScriptInjectionsConfig,
                ) => T,
            }) => ConstructorParams<C>,
        },
    ) {

    }
}