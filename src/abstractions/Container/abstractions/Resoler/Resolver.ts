import ProcessResolver from './interfaces/ProcessResolver';

export default abstract class Resolver {
    public abstract process(): ProcessResolver;
}