import ProcessResolver from './ProcessResolver';

export default interface Resolver {
    process: () => ProcessResolver,
}