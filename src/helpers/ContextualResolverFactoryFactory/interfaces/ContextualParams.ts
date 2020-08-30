import { Context } from "../../../types/Context";

export default interface ContextualParams<C extends Context, T extends unknown[]> {
    context: C;
    resolvers: readonly [...T];
}