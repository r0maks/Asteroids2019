var sketch = (p: p5) => {

    let ship: Ship;
    let missiles = [] as Missle[];
    let asteroids = [] as Asteroid[];
    let stars = [] as Star[];
    let explostionParticles = [] as IExplosionParticle[];
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
        ship = new Ship(p);
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = () => {
        renderStaticBackgroundLayer();
        renderDynamicBackgroundLayer();
        renderAll();
        handleKeyboardInput();
    }

    function renderStaticBackgroundLayer() {
        p.background(BACKGROUND);
        p.push();
        p.stroke(255);
        for (let index = 0; index < 15; index++) {
            p.point(p.random(0, p.windowWidth), p.random(0, p.windowHeight));
        }
        p.pop();
    }

    function renderDynamicBackgroundLayer() {
        handleStars();
    }

    function renderAll() {
        ship.draw(p, shipImg);
        handleCollisions();
        explostionParticles = handleExplosions(p, explostionParticles);
        showHealth(p, ship);
        handleMissles();
        handleAsteroids();
    }

    function handleMissles() {
        // filter out the missles that are off screen
        missiles = missiles.filter(m => m.yPos <= p.windowHeight && !m.isDestroyed);
        missiles.forEach(missle => {
            missle.draw(p);
            missle.move();
        });
    }

    function handleCollisions() {
        missiles.filter(m => !m.isDestroyed).forEach(missile => {
            asteroids.forEach(asteroid => {
                if (missile.collidesWith(asteroid)) {
                    asteroid.reset(p);
                    missile.destroy();
                    ship.score++;
                    addBasicExplosion(missile.tip.xPos, missile.tip.yPos)
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

    function addBasicExplosion(xPos: number, yPos: number): void {
        for (var i = 0; i < 20; i++) {
            explostionParticles.push(new BasicExplosionParticle(p, xPos, yPos));
        }
    }

}

var sketchP = new p5(sketch);