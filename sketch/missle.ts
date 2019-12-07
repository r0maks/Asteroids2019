class Missle {
    public xPos: number;
    public yPos: number;
    public width = 3;
    public height = 20;

    constructor(ship: Ship) {
        this.xPos = ship.xPos + (ship.width / 2)
        this.yPos = ship.yPos;
    }

    public draw(p: p5): void {
        p.push();
        p.fill(255,69,0);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    }

    public move(): void {
        this.yPos = this.yPos - 20;
    }

    public collidesWith(asteroid: Asteroid): boolean {
        const aYMax = asteroid.yPos;
        const aYMin = asteroid.yPos - asteroid.size;
        const aXMin = asteroid.xPos;
        const aXMax = asteroid.xPos + asteroid.size;

        return false; 
    }
}