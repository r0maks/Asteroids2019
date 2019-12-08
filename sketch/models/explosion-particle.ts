 class BasicExplosionParticle implements IExplosionParticle {
    public x: number;
    public y: number;
    public xDrift: number;
    public yDrift: number;
    public age: number;
    public color: number;

    constructor(p: p5, xPos: number, yPos: number) {
        this.x = xPos + p.random(-2, 2);
        this.y = yPos + p.random(-2, 2);
        this.xDrift = p.random(-30, 30),
        this.yDrift = p.random(-30, 30),
        this.age = 1;
        this.color = p.random(200, 255);
    }
}


