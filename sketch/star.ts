class Star {
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