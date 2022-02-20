import Class from "../../../Infrastructure/Class/Class";
import ConstructorsMap from "../ConstructorsMap/ConstructorsMap";
import MappingsMap from "../MappingsMap/MappingsMap";

export default interface TypeScriptInjectionsConfig {
    mappings: MappingsMap;
    constructors?: ConstructorsMap;
    singletons?: Array<Class<{}, any>>;
}
