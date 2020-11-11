import { AbstractClass } from "typescript-class-types";
import InjectParams from "../../../abstractions/InjectParams/InjectParams";
import StrictInjectParams from "../../../abstractions/StrictInjectParams/StrictInjectParams";

export default class InjectWithParams<F, T extends F> implements InjectParams {
    public readonly type: AbstractClass;
    public readonly to: AbstractClass;

    public constructor(config: StrictInjectParams<F, T>) {
        this.type = config.type;
        this.to = config.to;
    }
}