class Asteroid {
    public xPos: number;
    public yPos: number;
    public size: number;
    private speed: number;
    public windowHeight: number;
    public windowWidth: number;

    constructor(p: p5, public type: number) {
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.reset(p);
        // TODO: set random asteroid type
    }

    public move(p: p5) {
        this.yPos = this.yPos + this.speed;
        if (this.yPos > this.windowHeight) {
            this.reset(p);
        }
    }

    public reset(p: p5) {
        this.xPos = p.random(0, this.windowWidth);
        this.yPos = -100;
        this.size = p.random(30, 60);
        this.speed = p.random(1, 5);
    }

    public draw(p: p5, image: p5.Image) {
        p.image(image, this.xPos, this.yPos, this.size, this.size);
    }
}