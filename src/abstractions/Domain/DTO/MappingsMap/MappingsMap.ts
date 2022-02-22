import AbstractClass from "../../../Infrastructure/AbstractClass/AbstractClass";
import Class from "../../../Infrastructure/Class/Class";

export default interface MappingsMap extends Map<AbstractClass<unknown>, Class<unknown, any[]>> {
    set<T>(key: AbstractClass<T>, value: Class<T, any[]>): this;
}