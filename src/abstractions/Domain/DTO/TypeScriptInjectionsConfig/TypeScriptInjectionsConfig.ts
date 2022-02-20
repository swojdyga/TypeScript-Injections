import Class from "../../../Infrastructure/Class/Class";
import Constructor from "../../ValueObjects/Constructor/Constructor";
import MappingsMap from "../MappingsMap/MappingsMap";

export default interface TypeScriptInjectionsConfig {
    mappings: MappingsMap;
    constructors?: Array<Constructor<Class<{}, any[]>>>;
    singletons?: Array<Class<{}, any>>;
}
