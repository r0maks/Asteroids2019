class Star {
    public xPos: number;
    public yPos: number;
    public width: number;
    public height: number;
    public speed: number;
    public windowHeight: number;
    public windowWidth: number;
    constructor(p: p5) {
        this.width = p.random(15, 60);
        this.height = p.random(1, 2);
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.xPos = p.random(0, this.windowWidth);
        this.yPos = p.random(-100, this.windowHeight);
        this.speed = p.random(10, 30);
    }
    public draw(p: p5) {
        p.push();
        p.fill(80);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    }
    public move() {
        this.xPos = this.xPos - this.speed;
        if (this.xPos < 0) {
            this.xPos = this.windowWidth;
        }
    }
}