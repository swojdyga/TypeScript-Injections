import { AbstractClass, Class } from "typescript-class-types";
import Resolver from "../../../../../abstractions/Container/abstractions/Resoler/Resolver";
import { ResolvingElement } from "../../../../../abstractions/Container/abstractions/Resoler/types/ResolvingElement";
import IsParentConstructor from "../../../../../abstractions/IsParentConstructor/IsParentConstructor";
import SingletonizeParams from "../../../../../abstractions/SingletonizeParams/SingletonizeParams";
import SingletonizeAfterResolveHookParams from "./interfaces/SingletonizeAfterResolveHookParams";
import SingletonizeCreateInstanceHookParams from "./interfaces/SingletonizeCreateInstanceHookParams";

export default class Singletonize implements Resolver {
    public constructor(
        private readonly isParentConstructor: IsParentConstructor,
        private readonly configs: SingletonizeParams[],
    ) {

    }

    public process() {
        const catchedInstances: AbstractClass[] = [];

            return {
                hooks: {
                    createInstance: <R extends ResolvingElement, T extends Class>(params: SingletonizeCreateInstanceHookParams<R, T>) => {
                        const config = this.configs.find((config) => {
                            return this.isParentConstructor.isParent(params.type, config.type)
                                || this.isParentConstructor.isParent(params.resolvingElement, config.type);
                        });

                        if(!config) {
                            return;
                        }
    
                        const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof params.type);
                        if(!catchedInstance) {
                            return;
                        }
                        
                        return {
                            createdInstance: catchedInstance as InstanceType<T>,
                        };
                    },
                    afterResolve: <R extends ResolvingElement, T extends object>(params: SingletonizeAfterResolveHookParams<R, T>) => {
                        const config = this.configs.find((config) => {
                            return params.object instanceof (config.type as Class)
                                || this.isParentConstructor.isParent(params.resolvingElement, config.type);
                        });

                        if(!config) {
                            return;
                        }
    
                        if(params.calledResolversInAfterResolveHook.some((calledResolver) => {
                            if(!calledResolver.result) {
                                return false;
                            }
    
                            if(!('Singletonize' in calledResolver.result)) {
                                return false;
                            }
    
                            if((calledResolver.result as { Singletonize: typeof Singletonize }).Singletonize !== Singletonize) {
                                return false;
                            }
    
                            return true;
                        })) {
                            return;
                        }
            
                        if(catchedInstances.find((catchedInstance) => catchedInstance === params.object as AbstractClass)) {
                            return;
                        }
                    
                        catchedInstances.push(params.object as AbstractClass);
    
                        return {
                            Singletonize,
                        };
                    },
                },
            };
    }
}