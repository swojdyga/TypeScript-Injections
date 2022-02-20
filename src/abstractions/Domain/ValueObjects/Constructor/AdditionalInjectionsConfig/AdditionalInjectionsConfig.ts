import Class from "../../../../Infrastructure/Class/Class";
import Constructor from "../Constructor";
import MappingsMap from "../../../DTO/MappingsMap/MappingsMap";

export default interface AdditionalInjectionsConfig {
    mappings?: MappingsMap;
    constructors?: Array<Constructor<Class<{}, any[]>>>;
}
