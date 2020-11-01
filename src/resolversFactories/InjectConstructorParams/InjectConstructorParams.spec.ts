import "mocha";
import { expect } from "chai";
import InjectConstructorParams from './InjectConstructorParams';
import { HookResolve } from '../../types/HookResolve';
import { AbstractClass, Class } from 'typescript-class-types';

describe(`InjectConstructorParams`, () => {
    it(`Should return constructor params in beforeCreateInstance hook.`, () => {
        class MainClass {
            constructor(public welcomeText: string) {

            }
        }

        const resolvers = InjectConstructorParams({
            type: MainClass,
            params: [
                () => 'Hello World!',
            ],
        });

        const resolverProcess = resolvers[0].process();

        const resolve: HookResolve = <T extends AbstractClass | Class>(type: T) => new (type as unknown as Class<T>)() as unknown as T extends AbstractClass<infer U> ? U : never;

        const beforeCreateInstanceHookResult = resolverProcess.hooks.beforeCreateInstance({
            resolve,
            type: MainClass,
            constructorParams: [],
        });

        const constructorParams = beforeCreateInstanceHookResult ? beforeCreateInstanceHookResult.constructorParams : false;

        expect(constructorParams).to.be.instanceOf(Array);
        expect((constructorParams as [welcomeText: string])[0]).to.be.equals(`Hello World!`);
    });

    it(`Should have access to resolve method in concrete property return method.`, () => {
        class MainClass {
            constructor(public resolve: HookResolve) {

            }
        }

        const resolvers = InjectConstructorParams({
            type: MainClass,
            params: [
                ({resolve}) => resolve,
            ],
        });

        const resolverProcess = resolvers[0].process();

        const resolve: HookResolve = <T extends AbstractClass | Class>(type: T) => new (type as unknown as Class<T>)() as unknown as T extends AbstractClass<infer U> ? U : never;

        const beforeCreateInstanceHookResult = resolverProcess.hooks.beforeCreateInstance({
            resolve,
            type: MainClass,
            constructorParams: [],
        });

        const constructorParams = beforeCreateInstanceHookResult ? beforeCreateInstanceHookResult.constructorParams : false;

        expect(constructorParams).to.be.instanceOf(Array);
        expect((constructorParams as [resolve: HookResolve])[0]).to.be.equals(resolve);
    });
});