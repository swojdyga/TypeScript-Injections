import InjectParams from '../../../../../abstractions/InjectParams/InjectParams';
import InjectInjectHookParams from './interfaces/InjectInjectHookParams';
import Resolver from '../../../../../abstractions/Container/abstractions/Resoler/Resolver';
import { ResolvingElement } from '../../../../../abstractions/Container/abstractions/Resoler/types/ResolvingElement';

export default class Inject implements Resolver {
    public constructor(private readonly configs: InjectParams[]) {

    }

    public process() {
        return {
            hooks: {
                inject: <R extends ResolvingElement>(params: InjectInjectHookParams<R>) => {
                    const config = this.configs.find((config) => !!~params.resolvingElements.indexOf(config.type as R));
                    if(!config) {
                        return;
                    }

                    return {
                        injectedObject: config.to as unknown as R,
                    };
                },
            },
        };
    }
}