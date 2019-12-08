class Ship {

    public width = 75;
    public height = 75;
    public xPos: number;
    public yPos: number;
    public health: number;
    public xSpeed: number;
    public ySpeed: number;
    public lastDirections = [] as number[];
    public windowHeight: number;
    public windowWidth: number;

    constructor(p: p5) {
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.xPos = this.windowWidth / 2;
        this.yPos = this.windowHeight / 2;
        this.health = 100;
        this.xSpeed = 5;
        this.ySpeed = 5;
    }
    public draw(p: p5, image: p5.Image) {

        this.shiftPosition();
        this.render(p, image);
    }
    private render(p: p5, image: p5.Image) {
        p.image(image, this.xPos, this.yPos, this.width, this.height);
    }
    public get top(): number {
        return this.yPos;
    }
    public get left(): number {
        return this.xPos;
    }
    public get right(): number {
        return this.xPos + this.width;
    }
    public get bottom(): number {
        return this.yPos + this.height;
    }
    public moveRight() {
        if (this.right < this.windowWidth) {
            this.addDirectionHistory(MoveDirections.Right);
        }
    }
    public moveLeft() {
        if (this.left > 0) {
            this.addDirectionHistory(MoveDirections.Left);
        }
    }
    public moveUp() {
        if (this.top > 0) {
            this.addDirectionHistory(MoveDirections.Up);
        }
    }
    public moveDown() {
        if (this.bottom < this.windowHeight) {
            this.addDirectionHistory(MoveDirections.Down);
        }
    }
    private shiftPosition() {
        this.lastDirections.slice().reverse().forEach(direction => {
            switch (direction) {
                case MoveDirections.Up:
                    this.yPos--;
                    break;
                case MoveDirections.Down:
                    this.yPos++;
                    break;
                case MoveDirections.Right:
                    this.xPos++;
                    break;
                case MoveDirections.Left:
                    this.xPos--;
                    break;
                default:
                    break;
            }
        });
    }
    private addDirectionHistory(direction: number) {
        if (this.lastDirections.length > 2) {
            this.lastDirections.shift();
        }
        this.lastDirections.push(direction);
    }
}