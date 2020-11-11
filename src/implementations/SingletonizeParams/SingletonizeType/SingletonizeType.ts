import { AbstractClass } from "typescript-class-types";
import SingletonizeParams from "../../../abstractions/SingletonizeParams/SingletonizeParams";

export default class SingletonizeType implements SingletonizeParams {
    public readonly type: AbstractClass;

    public constructor(config: SingletonizeParams) {
        this.type = config.type;
    }
}