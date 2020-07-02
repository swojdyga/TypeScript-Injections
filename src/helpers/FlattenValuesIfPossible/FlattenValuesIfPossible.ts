import { FlattenArrayIfPossible } from '../../types/FlattenArrayIfPossible';

export default function FlattenValuesIfPossible<T>(elements: Array<T>): Array<FlattenArrayIfPossible<T>> {
    return elements.flatMap((element) => {
        if(element instanceof Function) {
            return [element];
        }

        return element;
    }) as Array<FlattenArrayIfPossible<T>>;
}