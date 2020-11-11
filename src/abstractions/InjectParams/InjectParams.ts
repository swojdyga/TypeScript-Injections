import { AbstractClass } from "typescript-class-types";

export default abstract class InjectParams {
    public abstract readonly type: AbstractClass;
    public abstract readonly to: AbstractClass;
}