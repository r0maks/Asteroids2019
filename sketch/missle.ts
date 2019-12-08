class Missle {
    public xPos: number;
    public yPos: number;
    public width = 20;
    public height = 2;
    constructor(ship: Ship) {
        this.xPos = ship.xPos + ship.width;
        this.yPos = ship.yPos + (ship.width / 2);
    }
    public draw(p: p5): void {
        p.push();
        p.fill(255,69,0);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    }
    public move(): void {
        this.xPos = this.xPos + 20;
    }
    public collidesWith(asteroid: Asteroid, p: p5): boolean {

        return false;

        
    }
}