export type InjectConstructorParamsParamsParams<T extends unknown[], A extends unknown[]> = ReturnType<
    T extends [infer U, ...infer Y]
        ? () => [(...args: A) => U, ...InjectConstructorParamsParamsParams<Y, A>]
        : T extends [infer U]
            ? () => [(...args: A) => U]
            : () => []
>;
