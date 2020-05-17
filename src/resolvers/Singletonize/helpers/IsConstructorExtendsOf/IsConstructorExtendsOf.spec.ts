import "mocha";
import { expect } from "chai";
import IsConstructorExtendsOf from './IsConstructorExtendsOf';

describe(`IsConstructorExtendsOf`, () => {
    it(`Should return positive result during check is MainClass class is extends BaseClass class.`, () => {
        class BaseClass {

        }

        class MainClass extends BaseClass {

        }

        expect(IsConstructorExtendsOf(MainClass, BaseClass)).to.be.equals(true);
    });

    it(`Should return positive result during check is MainClass class is extends BaseBaseClass class.`, () => {
        class BaseBaseClass {

        }

        class BaseClass extends BaseBaseClass {

        }

        class MainClass extends BaseClass {

        }

        expect(IsConstructorExtendsOf(MainClass, BaseBaseClass)).to.be.equals(true);
    });

    it(`Should return negative result during check is OtherMainClass class is extends MainClass class.`, () => {
        class MainClass {

        }

        class OtherMainClass {

        }

        expect(IsConstructorExtendsOf(OtherMainClass, MainClass)).to.be.equals(false);
    });
});