import Class from "../../../../Infrastructure/Class/Class";
import Constructor from "../Constructor";
import Mapping from "../../Mapping/Mapping";

export default interface AdditionalInjectionsConfig {
    mappings?: Array<Mapping<unknown>>;
    constructors?: Array<Constructor<Class<{}, any[]>>>;
}
