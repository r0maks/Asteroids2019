var sketch = (p: p5) => {

    let ship: Ship;
    let missiles = [] as Missle[];
    let asteroids = [] as Asteroid[];
    let stars = [] as Star[];
    let shipImg: p5.Image;
    let asteroidImages = [] as p5.Image[];
    let asteroid1: p5.Image;
    let asteroidLimit: number;

    p.preload = () => {
        shipImg = p.loadImage(SHIP_IMG);
        asteroidLimit = ASTEROIDS_MAX;
        ASTEROID_TYPES.forEach(img => {
            asteroidImages.push(p.loadImage(img));
        });
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
        ship = new Ship(p);
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = () => {
        p.background(BACKGROUND);
        renderAll();
        handleKeyboardInput();
    }

    function renderAll() {
        handleStars();
        ship.draw(p, shipImg);
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
            missle.move();
        });
    }

    function handleCollisions() {
        missiles.forEach(missle => {
            asteroids.forEach(asteroid => {
                if (missle.collidesWith(asteroid, p)) {
                    asteroid.reset(p);
                }
            });
        });
    }

    function handleAsteroids() {
        while (asteroids.length < asteroidLimit) {
            asteroids.push(new Asteroid(p, p.floor(p.random() * asteroidImages.length)));
        }
        asteroids.forEach(a => {
            a.draw(p, asteroidImages[a.type]);
            a.move(p);
        });
    }

    function handleStars() {
        while (stars.length < STARS_MAX) {
            stars.push(new Star(p));
        }
        stars.forEach(s => {
            s.draw(p);
            s.move();
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

    function handleKeyboardInput() {
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