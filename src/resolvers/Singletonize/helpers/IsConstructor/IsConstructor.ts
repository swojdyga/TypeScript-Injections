import { Class } from 'typescript-class-types';

export default function IsConstructor(element: unknown): element is Class {
    return element instanceof Function;
}