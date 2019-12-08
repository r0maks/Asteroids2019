class Missle implements IDestroyable {
    public xPos: number;
    public yPos: number;
    public width = 20;
    public height = 2;
    public speed = 20;
    public isDestroyed = false;
    constructor(ship: Ship) {
        this.xPos = ship.xPos + ship.width;
        this.yPos = ship.yPos + (ship.width / 2);
    }
    public draw(p: p5): void {
        p.push();
        p.noStroke();
        p.fill(255,69,0);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    }
    public move(): void {
        this.xPos = this.xPos + this.speed;
    }
    public get tip(): Point {
        return new Point(
            this.xPos + (this.width / 2),
            this.yPos
        );
    }
    public collidesWith(asteroid: Asteroid): boolean {
        const x = this.xPos + (this.width / 2);
        const y = this.yPos;
        return x >= asteroid.left &&
            x <= asteroid.right &&
            y >= asteroid.top &&
            y <= asteroid.bottom;
    }
    public destroy(): void {
        this.isDestroyed = true;
    }
}