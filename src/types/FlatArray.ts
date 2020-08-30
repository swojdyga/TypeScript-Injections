/**
 * https://github.com/microsoft/TypeScript/issues/40250#issuecomment-681644335
 */
export type FlatArray<A extends readonly unknown[]> = ReturnType<
    // Empty Array case
    A extends [] ?
        () => []
        : A extends readonly [] ?
            () => readonly []
            // Tuple case
            : A extends readonly [infer U, ...infer V] ?
                A extends unknown[] ?
                    // Mutable tuple case
                    U extends readonly unknown[] ?
                        () => [...U, ...FlatArray<V>]
                        : () => [U, ...FlatArray<V>]
                    // Readonly tuple case
                    : U extends readonly unknown[] ?
                        () => readonly [...U, ...FlatArray<V>]
                        : () => readonly [U, ...FlatArray<V>]
                // Array case
                : A extends (infer U)[] ?
                    U extends readonly (infer V)[] ?
                        () => V[]
                        : () => U[]
                    // ReadonlyArray case
                    : A extends readonly (infer U)[] ?
                        U extends readonly (infer V)[] ?
                            () => readonly V[]
                            : () => readonly U[]
                        : never
>;