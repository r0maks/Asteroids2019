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
    }

    public move(p: p5) {
        this.xPos = this.xPos - this.speed;
        if (this.xPos < 0) {
            this.reset(p);
        }
    }

    public reset(p: p5) {
        this.xPos = p.random(this.windowWidth + 30, this.windowWidth + 100);
        this.yPos = p.random(0, this.windowHeight);
        this.size = p.random(30, 60);
        this.speed = p.random(1, 5);
    }

    public draw(p: p5, image: p5.Image) {
        p.image(image, this.xPos, this.yPos, this.size, this.size);
    }
}