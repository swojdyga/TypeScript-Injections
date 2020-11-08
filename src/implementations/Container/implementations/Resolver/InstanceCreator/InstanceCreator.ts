import { Class } from 'typescript-class-types';
import Resolver from '../../../../../abstractions/Container/abstractions/Resoler/Resolver';
import InstanceCreatorCreateInstanceHookParams from './interfaces/InstanceCreatorCreateInstanceHookParams';

export default class InstanceCreator implements Resolver {
    public process() {
        return {
            hooks: {
                createInstance: <T extends Class>(params: InstanceCreatorCreateInstanceHookParams<T>) => {
                    return {
                        //can't detect at runtime is it an abstract class :(
                        createdInstance: new params.type(...params.constructorParams) as InstanceType<T>,
                    };
                },
            }
        }
    }
}