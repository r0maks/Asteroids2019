class Ship implements IDrawable {

    public static height = 25;
    public static width = 20;
    // represents the tip of the space ship
    public xPos: number;
    public yPos: number;
    public health: number;

    constructor(x: number, y: number) {
        this.xPos = x;
        this.yPos = y;
        this.health = 100;
    }

    public draw(p: p5) {
        // calculate the points from offsets of the center point
        p.triangle(
            this.xPos + Ship.width, this.yPos + Ship.height, 
            this.xPos - Ship.width, this.yPos + Ship.height,
            this.xPos, this.yPos - Ship.height
        );
    }

}

class Asteroid implements IDrawable {
    // represents the tip of the space ship
    public xPos: number;
    public yPos: number;
    public size: number;

    constructor(x: number, y: number, size: number) {
        this.xPos = x;
        this.yPos = y;
        this.size = size;
    }

    public draw(p: p5) {
        p.ellipse(this.xPos, this.yPos, this.size, this.size);
    }
}

class Missle implements IDrawable {
    // represents the tip of the space ship
    public xPos: number;
    public yPos: number;

    constructor(x: number, y: number) {
        this.xPos = x;
        this.yPos = y;
    }

    public draw(p: p5) {
        p.push();
        p.fill(255,69,0);
        p.ellipse(this.xPos, this.yPos, 3, 20);
        p.pop();
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
        // todo: randomize the color slightly
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