import Class from "../../../Infrastructure/Class/Class";
import Constructor from "../../ValueObjects/Constructor/Constructor";
import Mapping from "../../ValueObjects/Mapping/Mapping";

export default interface TypeScriptInjectionsConfig {
    mappings: Array<Mapping<{}, Class<{}, any[]>>>;
    constructors: Array<Constructor<Class<{}, any[]>>>;
}
