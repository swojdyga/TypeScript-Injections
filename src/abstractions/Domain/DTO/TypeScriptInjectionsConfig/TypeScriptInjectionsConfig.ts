import Class from "../../../Infrastructure/Class/Class";
import Constructor from "../../ValueObjects/Constructor/Constructor";
import Mapping from "../../ValueObjects/Mapping/Mapping";

export default interface TypeScriptInjectionsConfig {
    mappings: Array<Mapping<unknown>>;
    constructors?: Array<Constructor<Class<{}, any[]>>>;
    singletons?: Array<Class<{}, any>>;
}
