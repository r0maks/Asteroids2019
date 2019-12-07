class Ship implements IDrawable {

    public static height = 25;
    public static width = 20;
    // represents the tip of the space ship
    public xPos: number;
    public yPos: number;
    public health: number;
    public speed: number;

    constructor(x: number, y: number) {
        this.xPos = x;
        this.yPos = y;
        this.health = 100;
        this.speed = 5;
    }

    public draw(p: p5) {
        // calculate the points from offsets of the center point
        // TODO: add floating mechanic where ship continues to drift
        // based on the last direction it went
        p.triangle(
            this.xPos + Ship.width, this.yPos + Ship.height, 
            this.xPos - Ship.width, this.yPos + Ship.height,
            this.xPos, this.yPos - Ship.height
        );
    }

    public moveRight() {
        this.xPos = this.xPos + this.speed;
    }

    public moveLeft() {
        this.xPos = this.xPos - this.speed;
    }

    public moveUp() {
        this.yPos = this.yPos - this.speed;
    }

    public moveDown() {
        this.yPos = this.yPos + this.speed;
    }

}

class Asteroid implements IDrawable {
    public xPos: number;
    public yPos: number;
    public size: number;
    private speed: number;

    constructor(p: p5) {
        this.reset(p);
    }

    public move(p: p5) {
        this.yPos = this.yPos + this.speed;
        if (this.yPos > p.windowHeight) {
            this.reset(p);
        }
    }

    public reset(p: p5) {
        this.xPos = p.random(0, p.windowWidth);
        this.yPos = 0;
        this.size = p.random(10, 30);
        this.speed = p.random(1, 5);
    }

    public draw(p: p5) {
        p.ellipse(this.xPos, this.yPos, this.size, this.size);
    }
}

class Missle implements IDrawable {
    // represents the tip of the space ship
    public xPos: number;
    public yPos: number;

    constructor(ship: Ship) {
        this.xPos = ship.xPos;
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


class Star implements IDrawable {
    public xPos: number;
    public yPos: number;

    constructor(x: number, y: number) {
        this.xPos = x;
        this.yPos = y;
    }

    public draw(p: p5) {
        p.push();
        p.fill(255, 255, 255);
        const w = random(1, 3);
        const h = random(15, 20);
        p.ellipse(this.xPos, this.yPos, w, h);
        p.pop();
    }
}


interface IDrawable {
    draw(p: p5): void;
    xPos: number;
    yPos: number;
}