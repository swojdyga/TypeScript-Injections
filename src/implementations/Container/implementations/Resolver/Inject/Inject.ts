import InjectParams from '../../../../../abstractions/InjectParams/InjectParams';
import InjectInjectHookParams from './interfaces/InjectInjectHookParams';
import Resolver from '../../../../../abstractions/Container/abstractions/Resoler/Resolver';

export default class Inject implements Resolver {
    public constructor(private readonly configs: InjectParams[]) {

    }

    public process() {
        return {
            hooks: {
                inject: <T extends object>(params: InjectInjectHookParams<T>) => {
                    const config = this.configs.find((config) => config.type === params.object);
                    if(!config) {
                        return;
                    }

                    return {
                        injectedObject: config.to as unknown as T,
                    };
                },
            },
        };
    }
}