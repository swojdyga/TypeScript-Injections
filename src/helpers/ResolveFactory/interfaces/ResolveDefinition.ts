import { AbstractClass } from 'typescript-class-types';

export default interface ResolveDefinition<L extends AbstractClass<{}>> {
    type: L;
}