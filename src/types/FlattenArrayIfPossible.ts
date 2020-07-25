export type FlattenArrayIfPossible<T> = T extends Array<infer U> ? U : T;