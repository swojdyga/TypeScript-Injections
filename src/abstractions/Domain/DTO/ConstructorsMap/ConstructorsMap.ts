import AbstractClass from "../../../Infrastructure/AbstractClass/AbstractClass";
import Class from "../../../Infrastructure/Class/Class";
import { ConstructorParams } from "../../../Infrastructure/ConstructorParams/ConstructorParams";
import AdditionalInjectionsConfig from "./AdditionalInjectionsConfig/AdditionalInjectionsConfig";

export default interface ConstructorsMap extends Map<
    Class<{}, any[]>,
    (injections: {
        resolve: <T>(
            abstraction: AbstractClass<T>,
            config?: AdditionalInjectionsConfig,
        ) => T,
    }) => ConstructorParams<Class<{}, any[]>>
> {
    set<C extends Class<{}, any[]>>(key: C, value: (injections: {
        resolve: <T>(
            abstraction: AbstractClass<T>,
            config?: AdditionalInjectionsConfig,
        ) => T,
    }) => ConstructorParams<C>): this;
}