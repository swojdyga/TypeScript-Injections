import InjectPropsParamsParamsParamParams from './InjectPropsParamsParamsParamParams';

export type InjectPropsParamsParams<T> = {
    [key in keyof T]: (params: InjectPropsParamsParamsParamParams) => T[key];
}