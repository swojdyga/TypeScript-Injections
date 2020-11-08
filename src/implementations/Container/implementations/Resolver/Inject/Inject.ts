import InjectParams from '../../../../../abstractions/InjectParams/InjectParams';
import InjectInjectHookParams from './interfaces/InjectInjectHookParams';
import { AbstractClass, Class } from 'typescript-class-types';
import Resolver from '../../../../../abstractions/Container/abstractions/Resoler/Resolver';

export default class Inject<I extends object, F extends Class<I> | AbstractClass<I>, T extends Class<I>> implements Resolver {
    public constructor(private readonly config: InjectParams<F, T>) {

    }

    public process() {
        return {
            hooks: {
                inject: <T extends object | F>(params: InjectInjectHookParams<T>) => {
                    if(this.config.type === params.object) {
                        return {
                            injectedObject: this.config.to as unknown as T,
                        };
                    }

                    return;
                },
            },
        };
    }
}