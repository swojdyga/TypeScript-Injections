import { Class } from "typescript-class-types";

export default interface ResolverCreateInstanceHookResolveResult<T extends Class> {
    createdInstance?: InstanceType<T>;
}