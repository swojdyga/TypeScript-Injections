import MappingsMap from "../../../DTO/MappingsMap/MappingsMap";
import ConstructorsMap from "../ConstructorsMap";

export default interface AdditionalInjectionsConfig {
    mappings?: MappingsMap;
    constructors?: ConstructorsMap;
}
