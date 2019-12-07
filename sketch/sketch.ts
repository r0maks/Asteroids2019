const SPACEBAR = 32;
const UP_ARROW = 38;
const LEFT_ARROW = 37;
const DOWN_ARROW = 40;
const RIGHT_ARROW = 39;
const ASTEROIDS_MAX = 30;

var sketch = (p: p5) => {

    let ship: Ship;
    let missiles = [] as Missle[];
    let asteroids = [] as Asteroid[];

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
        handleCollisions();
        showHealth();
        handleMissles();
        handleAsteroids();
    }

    function handleMissles() {
        // filter out the missles that are off screen
        missiles = missiles.filter(m => m.yPos <= p.windowHeight);
        missiles.forEach(missle => {
            missle.draw(p);
            missle.move(p);
        });
    }

    function handleCollisions() {
        missiles.forEach(missle => {
            asteroids.forEach(asteroid => {
                if (missle.collidesWith(asteroid)) {
                    asteroid.reset(p);
                }
            });
        });
    }

    function handleAsteroids() {
        while (asteroids.length < ASTEROIDS_MAX) {
            asteroids.push(new Asteroid(p));
        }
        asteroids.forEach(a => {
            a.draw(p);
            a.move(p);
        });
    }

    p.keyPressed = () => {
        console.log(p.keyCode);
        if (p.keyCode === SPACEBAR) {
            missiles.push(
                new Missle(ship)
            );
        }
    }

    function handleArrowKeys() {
        // up
        if (p.keyIsDown(UP_ARROW)) {
            ship.moveUp();
        }
        // down 
        if (p.keyIsDown(DOWN_ARROW)) {
            ship.moveDown();
        }
        // left
        if (p.keyIsDown(LEFT_ARROW)) {
            ship.moveLeft();
        }
        // right
        if (p.keyIsDown(RIGHT_ARROW)) {
            ship.moveRight();
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