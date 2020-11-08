import { Class } from 'typescript-class-types';
import InjectConstructorParamsBeforeCreateInstanceHookParams from './interfaces/InjectConstructorParamsBeforeCreateInstanceHookParams';
import ConstructorParams from '../../../../../abstractions/ConstructorParams/ConstructorParams';
import Resolver from '../../../../../abstractions/Container/abstractions/Resoler/Resolver';
import ConstructorParamArguments from '../../../../../abstractions/ConstructorParams/interfaces/ConstructorParamArguments';

export default class InjectConstrutorParams implements Resolver {
    private readonly constructorParamsMap = new Map<Class, ConstructorParameters<Class>>();
    
    public constructor(config: ConstructorParams[]) {
        config.forEach(({type, params}) => {
            this.constructorParamsMap.set(type, params);
        });
    }

    public process() {
        return {
            hooks: {
                beforeCreateInstance: <T extends Class>(params: InjectConstructorParamsBeforeCreateInstanceHookParams<T>) => {
                    if(!this.constructorParamsMap.has(params.type)) {
                        return;
                    }
                    
                    return {
                        constructorParams: (this.constructorParamsMap.get(params.type) as ConstructorParameters<T>)
                            .map((param: (params: ConstructorParamArguments) => keyof ConstructorParameters<T>) => {
                                return param({
                                    resolve: params.resolve,
                                });
                            }) as ConstructorParameters<T>,
                    };
                },
            },
        }
    }
}