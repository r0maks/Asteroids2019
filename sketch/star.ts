class Star {
    public xPos: number;
    public yPos: number;
    public width: number;
    public height: number;
    public speed: number;
    public windowHeight: number;
    constructor(p: p5) {
        this.width = p.random(1, 3);
        this.height = p.random(15, 20);
        this.windowHeight = p.windowHeight;
        this.xPos = p.random(0, p.windowWidth);
        this.yPos = p.random(-100, p.windowHeight);
        this.speed = p.random(0, 8);
    }
    public draw(p: p5) {
        p.push();
        p.fill(42);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    }
    public move() {
        this.yPos = this.yPos + this.speed;
        if (this.yPos > this.windowHeight) {
            this.yPos = 0;
        }
    }
}