const SPACEBAR = 32;
const UP_ARROW = 38;
const LEFT_ARROW = 37;
const DOWN_ARROW = 40;
const RIGHT_ARROW = 39;
const STARS_LIMIT = 500;

var sketch = (p: p5) => {

    let ship: Ship;
    let missiles = [] as Missle[];
    let stars = [] as Star[];

    p.preload = () => {

    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
        // start the ship in the middle of the screen
        ship = new Ship(p.windowWidth / 2, p.windowHeight / 2);

    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = () => {
        p.background(42);
        renderAll();
        handleArrowKeys();
    }


    function renderAll() {
        ship.draw(p);
        showHealth();
        handleMissles();
        handleStars();
    }

    function handleMissles() {

        // filter out the missles that are off screen
        missiles = missiles.filter(m => m.yPos <= p.windowHeight);

        missiles.forEach(missle => {
            missle.yPos = missle.yPos - 20;
            missle.draw(p);
        });
    }

    function handleStars() {
        
    }

    p.keyPressed = () => {
        console.log(p.keyCode);

        if (p.keyCode === SPACEBAR) {
            missiles.push(
                new Missle(ship.xPos + p.random(0, 3), ship.yPos)
            );
        }
    }

    function handleArrowKeys() {
        // up
        if (p.keyIsDown(UP_ARROW)) {
            ship.yPos = ship.yPos - 5;
        }
        // down 
        if (p.keyIsDown(DOWN_ARROW)) {
            ship.yPos = ship.yPos + 5;
        }
        // left
        if (p.keyIsDown(LEFT_ARROW)) {
            ship.xPos = ship.xPos - 5;
        }
        // right
        if (p.keyIsDown(RIGHT_ARROW)) {
            ship.xPos = ship.xPos + 5;
        }
    }

    function showHealth() {
        p.push();
        p.rect(25, 25, 100, 50);
        p.fill(255, 200, 0);
        p.rect(25, 25, ship.health, 50);
        p.pop();
    }
}

var sketchP = new p5(sketch);