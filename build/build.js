var Asteroid = (function () {
    function Asteroid(p) {
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.reset(p);
    }
    Asteroid.prototype.move = function (p) {
        this.yPos = this.yPos + this.speed;
        if (this.yPos > this.windowHeight) {
            this.reset(p);
        }
    };
    Asteroid.prototype.reset = function (p) {
        this.xPos = p.random(0, this.windowWidth);
        this.yPos = -50;
        this.size = p.random(10, 50);
        this.speed = p.random(1, 5);
    };
    Asteroid.prototype.draw = function (p, image) {
        p.image(image, this.xPos, this.yPos, this.size, this.size);
    };
    return Asteroid;
}());
var SPACEBAR = 32;
var UP_ARROW = 38;
var LEFT_ARROW = 37;
var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var ASTEROIDS_MAX = 30;
var BACKGROUND = 42;
var MoveDirections;
(function (MoveDirections) {
    MoveDirections[MoveDirections["Up"] = 1] = "Up";
    MoveDirections[MoveDirections["Down"] = 2] = "Down";
    MoveDirections[MoveDirections["Left"] = 3] = "Left";
    MoveDirections[MoveDirections["Right"] = 4] = "Right";
})(MoveDirections || (MoveDirections = {}));
var SHIP_IMG = 'assets/ship.png';
var ASTEROID_1 = 'assets/asteroid1.png';
var Missle = (function () {
    function Missle(ship) {
        this.xPos = ship.xPos + (ship.width / 2);
        this.yPos = ship.yPos;
    }
    Missle.prototype.draw = function (p) {
        p.push();
        p.fill(255, 69, 0);
        p.ellipse(this.xPos, this.yPos, 3, 20);
        p.pop();
    };
    Missle.prototype.move = function () {
        this.yPos = this.yPos - 20;
    };
    Missle.prototype.collidesWith = function (asteroid) {
        return (this.xPos - asteroid.xPos) * (this.xPos - asteroid.xPos) +
            (this.yPos - asteroid.yPos) * (this.yPos - asteroid.yPos)
            === (20 + asteroid.size) * (20 + asteroid.size);
    };
    return Missle;
}());
var Ship = (function () {
    function Ship(p) {
        this.width = 75;
        this.height = 75;
        this.lastDirections = [];
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.xPos = this.windowWidth / 2;
        this.yPos = this.windowHeight / 2;
        this.health = 100;
        this.xSpeed = 5;
        this.ySpeed = 5;
    }
    Ship.prototype.draw = function (p, image) {
        this.handleFloat();
        p.image(image, this.xPos, this.yPos, this.width, this.height);
    };
    Ship.prototype.moveRight = function () {
        this.xPos = this.xPos + this.xSpeed;
        this.addDirectionHistory(MoveDirections.Right);
    };
    Ship.prototype.moveLeft = function () {
        this.xPos = this.xPos - this.xSpeed;
        this.addDirectionHistory(MoveDirections.Left);
    };
    Ship.prototype.moveUp = function () {
        this.yPos = this.yPos - this.ySpeed;
        this.addDirectionHistory(MoveDirections.Up);
    };
    Ship.prototype.moveDown = function () {
        this.yPos = this.yPos + this.ySpeed;
        this.addDirectionHistory(MoveDirections.Down);
    };
    Ship.prototype.handleFloat = function () {
        var _this = this;
        this.lastDirections.slice().reverse().forEach(function (direction) {
            switch (direction) {
                case MoveDirections.Up:
                    _this.yPos--;
                    break;
                case MoveDirections.Down:
                    _this.yPos++;
                    break;
                case MoveDirections.Right:
                    _this.xPos++;
                    break;
                case MoveDirections.Left:
                    _this.xPos--;
                    break;
                default:
                    break;
            }
        });
    };
    Ship.prototype.addDirectionHistory = function (direction) {
        if (this.lastDirections.length > 2) {
            this.lastDirections.shift();
        }
        this.lastDirections.push(direction);
    };
    return Ship;
}());
var sketch = function (p) {
    var ship;
    var missiles = [];
    var asteroids = [];
    var shipImg;
    var asteroid1;
    p.preload = function () {
        shipImg = p.loadImage(SHIP_IMG);
        asteroid1 = p.loadImage(ASTEROID_1);
    };
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
        ship = new Ship(p);
    };
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = function () {
        p.background(BACKGROUND);
        renderAll();
        handleKeyboardInput();
    };
    function renderAll() {
        ship.draw(p, shipImg);
        handleCollisions();
        showHealth();
        handleMissles();
        handleAsteroids();
    }
    function handleMissles() {
        missiles = missiles.filter(function (m) { return m.yPos <= p.windowHeight; });
        missiles.forEach(function (missle) {
            missle.draw(p);
            missle.move();
        });
    }
    function handleCollisions() {
        missiles.forEach(function (missle) {
            asteroids.forEach(function (asteroid) {
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
        asteroids.forEach(function (a) {
            a.draw(p, asteroid1);
            a.move(p);
        });
    }
    p.keyPressed = function () {
        console.log(p.keyCode);
        if (p.keyCode === SPACEBAR) {
            missiles.push(new Missle(ship));
        }
    };
    function handleKeyboardInput() {
        if (p.keyIsDown(UP_ARROW)) {
            ship.moveUp();
        }
        if (p.keyIsDown(DOWN_ARROW)) {
            ship.moveDown();
        }
        if (p.keyIsDown(LEFT_ARROW)) {
            ship.moveLeft();
        }
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
};
var sketchP = new p5(sketch);
var Star = (function () {
    function Star(x, y) {
        this.xPos = x;
        this.yPos = y;
    }
    Star.prototype.draw = function (p) {
        p.push();
        p.fill(255, 255, 255);
        var w = random(1, 3);
        var h = random(15, 20);
        p.ellipse(this.xPos, this.yPos, w, h);
        p.pop();
    };
    return Star;
}());
//# sourceMappingURL=build.js.map