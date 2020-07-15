import { Context } from '../../types/Context';
import { AbstractClass } from 'typescript-class-types';
import { Resolver } from '../../types/Resolver';
import { BasicInstanceCreator } from '../../resolvers/BasicInstanceCreator/BasicInstanceCreator';
import FlattenValuesIfPossible from '../../helpers/FlattenValuesIfPossible/FlattenValuesIfPossible';
import NullableExcluder from '../../helpers/NullableExcluder/NullableExcluder';
import ArrayOfObjectsKeyValue from '../../helpers/ArrayOfObjectsKeyValue/ArrayOfObjectsKeyValue';

export default function ResolveFactory(definedResolvers: Array<Resolver>) {
    return function Resolve<C extends Context, O extends object>(
        context: C,
        type: AbstractClass<O>,
        additionalResolvers: Array<Resolver> = [],
    ): O {
        const predefinedResolvers: Array<Resolver> = [
            BasicInstanceCreator,
        ];

        const resolvers = [
            ...definedResolvers,
            ...additionalResolvers,
            ...predefinedResolvers,
        ];

        const object = NullableExcluder(ArrayOfObjectsKeyValue(FlattenValuesIfPossible(resolvers), 'injectHook')).reduce(
            (object, injectHook) => {
                return injectHook(context, object) || object;
            },
            type,
        );

        const resolvedObject = (() => {
            for(const resolveHook of NullableExcluder(ArrayOfObjectsKeyValue(FlattenValuesIfPossible(resolvers), 'resolveHook'))) {
                const resolvedObject = resolveHook(context, object);
                if(resolvedObject) {
                    return resolvedObject;
                }
            }

            return object;
        })();

        const instance = (() => {
            for(const createInstanceHook of NullableExcluder(ArrayOfObjectsKeyValue(FlattenValuesIfPossible(resolvers), 'createInstanceHook'))) {
                const instance = createInstanceHook(context, resolvedObject);
                if(instance) {
                    return instance;
                }
            }
        })();

        if(!instance) {
            throw new Error('Failed to create object instance.');
        }

        NullableExcluder(ArrayOfObjectsKeyValue(FlattenValuesIfPossible(resolvers), 'afterResolveHook')).forEach((afterResolveHook) => {
            afterResolveHook(context, instance);
        });

        return instance;
    };
}