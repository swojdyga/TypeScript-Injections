import Class from "../Class/Class";

/**
 * Custom implementation of ConstructorParameters.
 * It allows to use ConstructorParams as result of method, for example:
 * 
 * {
 *     readonly class: C,
 *     readonly params: () => ConstructorParams<C>,
 * },
 * 
 * With ConstructorParameters build type, TypeScript throw error:
 * Target requires 2 element(s) but source may have fewer.
 */
type ConstructorParamsInternal<T extends unknown[]> = ReturnType<
    T extends [infer U, ...infer Y]
        ? () => [U, ...ConstructorParamsInternal<Y>]
        : T extends [infer U]
            ? () => [U]
            : () => []
>;

export type ConstructorParams<C extends Class<{}, any[]>>
    = ConstructorParamsInternal<ConstructorParameters<C>>;