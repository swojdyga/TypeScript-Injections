import AbstractClass from "../../../Infrastructure/AbstractClass/AbstractClass";
import Class from "../../../Infrastructure/Class/Class";
import {
    ConstructorParamsAsMethodsWithParams
} from "../../../Infrastructure/ConstructorParamsAsMethodsWithParams/ConstructorParamsAsMethodsWithParams";
import AdditionalInjectionsConfig from "./AdditionalInjectionsConfig/AdditionalInjectionsConfig";

export default interface ConstructorsMap extends Map<
    Class<{}, any[]>,
    ConstructorParamsAsMethodsWithParams<Class<{}, any[]>, [
    {
        resolve: <T>(
            abstraction: AbstractClass<T>,
            config?: AdditionalInjectionsConfig,
        ) => T,
    },
]>
> {
    set<C extends Class<{}, any[]>>(key: C, value: ConstructorParamsAsMethodsWithParams<C, [
        {
            resolve: <T>(
                abstraction: AbstractClass<T>,
                config?: AdditionalInjectionsConfig,
            ) => T,
        },
    ]>): this;
}