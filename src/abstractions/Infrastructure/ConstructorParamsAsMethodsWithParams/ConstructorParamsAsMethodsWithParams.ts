import Class from "../Class/Class";

type ArrayOfMethods<T extends unknown[], A extends unknown[]> = {[key in keyof T]: (...args: A) => T[key]};

export type ConstructorParamsAsMethodsWithParams<C extends Class<{}, any[]>, P extends any[]>
    = ArrayOfMethods<ConstructorParameters<C>, P>;