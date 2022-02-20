import TypeScriptInjections from "../../../../abstractions/Domain/TypeScriptInjections/TypeScriptInjections";
import TypeScriptInjectionsConfig from "../../../../abstractions/Domain/DTO/TypeScriptInjectionsConfig/TypeScriptInjectionsConfig";
import AbstractClass from "../../../../abstractions/Infrastructure/AbstractClass/AbstractClass";
import Class from "../../../../abstractions/Infrastructure/Class/Class";
import MappingsMap from "../../../../abstractions/Domain/DTO/MappingsMap/MappingsMap";
import { ConstructorParams } from "../../../../abstractions/Infrastructure/ConstructorParams/ConstructorParams";
import AdditionalInjectionsConfig from "../../../../abstractions/Domain/DTO/ConstructorsMap/AdditionalInjectionsConfig/AdditionalInjectionsConfig";
import ConstructorsMap from "../../../../abstractions/Domain/DTO/ConstructorsMap/ConstructorsMap";

export default class MainTypeScriptInjections implements TypeScriptInjections {
    public resolve<T>(abstraction: AbstractClass<T>, config: TypeScriptInjectionsConfig): T {
        const abstractionsToImplementationsSingletons = new Map<AbstractClass<unknown>, {}>();
        const implementationsClassToImplementationsSingletons = new Map<Class<unknown, unknown[]>, {}>();

        return this.resolveInternal(
            abstraction,
            config,
            abstractionsToImplementationsSingletons,
            implementationsClassToImplementationsSingletons,
        );
    }

    public createReference<T>(): AbstractClass<T> {
        return {} as AbstractClass<T>;
    }

    public mappings(): MappingsMap {
        return new Map();
    }

    public constructors(): ConstructorsMap {
        return new Map();
    }

    private resolveInternal<T>(
        abstraction: AbstractClass<T>,
        config: TypeScriptInjectionsConfig,
        abstractionsToImplementationsSingletons: Map<AbstractClass<unknown>, {}>,
        implementationsClassToImplementationsSingletons: Map<Class<unknown, unknown[]>, {}>,
    ): T {
        if(abstractionsToImplementationsSingletons.has(abstraction)) {
            return abstractionsToImplementationsSingletons.get(abstraction) as T;
        }

        const implementationClass = config.mappings.get(abstraction) as Class<T, unknown[]>;
        if(!implementationClass) {
            throw new Error("Unable to resolve given abstraction.");
        }
        
        if(implementationsClassToImplementationsSingletons.has(implementationClass)) {
            const implementation = implementationsClassToImplementationsSingletons.get(implementationClass) as T;

            abstractionsToImplementationsSingletons.set(abstraction, implementation);
            return implementation;
        }

        const implementationConstructor = config.constructors?.get(implementationClass);
        
        const implementation = this.createImplementation(
            implementationClass,
            implementationConstructor,
            config,
            abstractionsToImplementationsSingletons,
            implementationsClassToImplementationsSingletons,
        );

        if(config.singletons && config.singletons.has(implementationClass)) {
            implementationsClassToImplementationsSingletons.set(implementationClass, implementation);
            abstractionsToImplementationsSingletons.set(abstraction, implementation);
        }

        return implementation;
    }

    private createImplementation<C>(
        implementationClass: Class<C, any[]>,
        implementationConstructor: ((injections: {
            resolve: <T>(
                abstraction: AbstractClass<T>,
                config?: AdditionalInjectionsConfig,
            ) => T,
        }) => ConstructorParams<Class<C, any[]>>) | undefined,
        config: TypeScriptInjectionsConfig,
        abstractionsToImplementationsSingletons: Map<AbstractClass<unknown>, {}>,
        implementationsClassToImplementationsSingletons: Map<Class<unknown, unknown[]>, {}>,
    ): C {
        if(!implementationConstructor) {
            return new implementationClass() as C;
        }

        return new implementationClass(...implementationConstructor({
            resolve: <T>(
                abstraction: AbstractClass<T>,
                additionalConfig?: AdditionalInjectionsConfig,
            ): T => this.resolveInternal(
                abstraction,
                additionalConfig
                    ? {
                        mappings: additionalConfig.mappings
                            ? new Map([...config.mappings, ...additionalConfig.mappings])
                            : config.mappings,
                        constructors: additionalConfig.constructors && config.constructors
                            ? new Map([...config.constructors, ...additionalConfig.constructors])
                            : (
                                additionalConfig.constructors
                                    ? additionalConfig.constructors
                                    : config.constructors
                            ),
                    }
                    : config,
                abstractionsToImplementationsSingletons,
                implementationsClassToImplementationsSingletons,
            ),
        })) as C;
    }
}