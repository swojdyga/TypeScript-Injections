import { Class } from 'typescript-class-types';

export default interface ResolveDefinition<L extends Class<{}>> {
    type: L;
}