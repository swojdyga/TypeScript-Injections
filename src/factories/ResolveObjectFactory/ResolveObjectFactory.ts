import { Context } from "../../types/Context";
import { Resolver } from '../../types/Resolver';
import ArrayOfObjectsKeyValue from '../../helpers/ArrayOfObjectsKeyValue/ArrayOfObjectsKeyValue';
import NullableExcluder from '../../helpers/NullableExcluder/NullableExcluder';
import FlattenValuesIfPossible from '../../helpers/FlattenValuesIfPossible/FlattenValuesIfPossible';

export default function ResolveObjectFactory(definedResolvers: Array<Resolver>) {
    return function ResolveObject<C extends Context, O extends object>(
        context: C,
        object: O,
        additionalResolvers: Array<Resolver> = [],
    ): O {
        const resolvers = [
            ...definedResolvers,
            ...additionalResolvers,
        ];

        const injectedObject = NullableExcluder(ArrayOfObjectsKeyValue(FlattenValuesIfPossible(resolvers), 'injectHook')).reduce(
            (object, injectHook) => {
                return injectHook(context, object) || object;
            },
            object,
        );

        const resolvedObject = (() => {
            for(const resolveHook of NullableExcluder(ArrayOfObjectsKeyValue(FlattenValuesIfPossible(resolvers), 'resolveHook'))) {
                const resolvedObject = resolveHook(context, injectedObject);
                if(resolvedObject) {
                    return resolvedObject;
                }
            }

            return injectedObject;
        })();

        NullableExcluder(ArrayOfObjectsKeyValue(FlattenValuesIfPossible(resolvers), 'afterResolveHook')).forEach((afterResolveHook) => {
            afterResolveHook(context, resolvedObject)
        });

        return resolvedObject;
    }
}