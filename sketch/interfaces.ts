interface IDestroyable {
    isDestroyed: boolean;
    destroy(): void;
}
interface IExplosionParticle {
    x: number;
    y: number;
    xDrift: number;
    yDrift: number;
    age: number;
    color: number;
}