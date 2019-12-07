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
        this.xSpeed = 3;
        this.ySpeed = 5;
    }

    public draw(p: p5, image: p5.Image) {
        this.handleFloat();
        p.image(image, this.xPos, this.yPos, this.width, this.height);
        // TODO: handle off canvas limits
    }

    public moveRight() {
        this.xPos = this.xPos + this.xSpeed;
        this.addDirectionHistory(MoveDirections.Right);
    }

    public moveLeft() {
        this.xPos = this.xPos - this.xSpeed;
        this.addDirectionHistory(MoveDirections.Left);
    }

    public moveUp() {
        this.yPos = this.yPos - this.ySpeed;
        this.addDirectionHistory(MoveDirections.Up);
    }

    public moveDown() {
        this.yPos = this.yPos + this.ySpeed;
        this.addDirectionHistory(MoveDirections.Down);
    }

    private handleFloat() {
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