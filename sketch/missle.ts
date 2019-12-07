class Missle {
    public xPos: number;
    public yPos: number;

    constructor(ship: Ship) {
        this.xPos = ship.xPos + (ship.width / 2)
        this.yPos = ship.yPos;
    }

    public draw(p: p5): void {
        p.push();
        p.fill(255,69,0);
        p.ellipse(this.xPos, this.yPos, 3, 20);
        p.pop();
    }

    public move(): void {
        this.yPos = this.yPos - 20;
    }

    public collidesWith(asteroid: Asteroid): boolean {
        return (this.xPos - asteroid.xPos) * (this.xPos - asteroid.xPos) + 
                     (this.yPos - asteroid.yPos) * (this.yPos - asteroid.yPos)
                     === (20 + asteroid.size) * (20 + asteroid.size);
    }
}