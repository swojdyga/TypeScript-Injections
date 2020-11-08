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
        private readonly config: SingletonizeParams,
    ) {

    }

    public process() {
        const catchedInstances: AbstractClass[] = [];

            return {
                hooks: {
                    createInstance: <R extends ResolvingElement, T extends Class>(params: SingletonizeCreateInstanceHookParams<R, T>) => {
                        const type = params.type;
                        
                        if(!this.isParentConstructor.isParent(type, this.config.type) && !this.isParentConstructor.isParent(params.resolvingElement, this.config.type)) {
                            return;
                        }
    
                        const catchedInstance = catchedInstances.find((catchedInstance) => catchedInstance instanceof type);
                        if(!catchedInstance) {
                            return;
                        }
                        
                        return {
                            createdInstance: catchedInstance as InstanceType<T>,
                        };
                    },
                    afterResolve: <R extends ResolvingElement, T extends object>(params: SingletonizeAfterResolveHookParams<R, T>) => {
                        if(!(params.object instanceof (this.config.type as Class)) && !this.isParentConstructor.isParent(params.resolvingElement, this.config.type)) {
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