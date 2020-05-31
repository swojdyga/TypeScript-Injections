import "mocha";
import { expect } from "chai";
import "./entities/vue-js";
import Vue, { CreateElement, VNode } from "vue";
import { mount } from "@vue/test-utils";
import { Component, Ref } from "vue-property-decorator";
import { Define, Inject, ResolveObject } from "../src/index";

describe(`Integration tests from README - Vue.js`, () => {
    it(`Should inject MyApplicationHeader into ApplicationHeader place.`, () => {
        @Component
        class ApplicationHeader extends Vue {
            public readonly siteName: string = ``;

            public render(createElement: CreateElement): VNode | void {
                return createElement(`div`, [
                    this.siteName,
                ]);
            }
        }

        @Component
        class MyApplicationHeader extends ApplicationHeader {
            public readonly siteName: string = `Hello World!`;
        }

        Define([
            Inject({
                type: ApplicationHeader,
                to: MyApplicationHeader,
            }),
        ]);

        @Component({
            components: {
                ApplicationHeader: ResolveObject(this, ApplicationHeader),
            }
        })
        class Application extends Vue {
            @Ref()
            public readonly applicationHeader?: ApplicationHeader;

            public render(createElement: CreateElement): VNode | void {
                return createElement(`div`, [
                    createElement(`application-header`, {
                        ref: `applicationHeader`,
                    })
                ]);
            }
        }

        const wrapper = mount(Application);
        expect(wrapper.vm.applicationHeader).not.to.be.equals(undefined);
        expect((wrapper.vm.applicationHeader as ApplicationHeader).siteName).to.be.equals(`Hello World!`);
    });
});