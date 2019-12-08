var Asteroid = (function () {
    function Asteroid(p, type) {
        this.type = type;
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.reset(p);
    }
    Asteroid.prototype.move = function (p) {
        this.xPos = this.xPos - this.speed;
        if (this.xPos < 0) {
            this.reset(p);
        }
    };
    Asteroid.prototype.reset = function (p) {
        this.xPos = p.random(this.windowWidth + 30, this.windowWidth + 100);
        this.yPos = p.random(0, this.windowHeight);
        this.size = p.random(30, 60);
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
var STARS_MAX = 20;
var BACKGROUND = 30;
var MoveDirections;
(function (MoveDirections) {
    MoveDirections[MoveDirections["Up"] = 1] = "Up";
    MoveDirections[MoveDirections["Down"] = 2] = "Down";
    MoveDirections[MoveDirections["Left"] = 3] = "Left";
    MoveDirections[MoveDirections["Right"] = 4] = "Right";
})(MoveDirections || (MoveDirections = {}));
var MissleTypes;
(function (MissleTypes) {
    MissleTypes[MissleTypes["Basic"] = 1] = "Basic";
})(MissleTypes || (MissleTypes = {}));
var SHIP_IMG = 'assets/ship.png';
var ASTEROID_0 = 'assets/asteroid0.png';
var ASTEROID_1 = 'assets/asteroid1.png';
var ASTEROID_2 = 'assets/asteroid2.png';
var ASTEROID_TYPES = [
    ASTEROID_0,
    ASTEROID_1,
    ASTEROID_2
];
var Missle = (function () {
    function Missle(ship) {
        this.width = 20;
        this.height = 2;
        this.xPos = ship.xPos + ship.width;
        this.yPos = ship.yPos + (ship.width / 2);
    }
    Missle.prototype.draw = function (p) {
        p.push();
        p.fill(255, 69, 0);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    };
    Missle.prototype.move = function () {
        this.xPos = this.xPos + 20;
    };
    Missle.prototype.collidesWith = function (asteroid, p) {
        return false;
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
        this.shiftPosition();
        this.render(p, image);
    };
    Ship.prototype.render = function (p, image) {
        p.image(image, this.xPos, this.yPos, this.width, this.height);
    };
    Object.defineProperty(Ship.prototype, "top", {
        get: function () {
            return this.yPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "left", {
        get: function () {
            return this.xPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "right", {
        get: function () {
            return this.xPos + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ship.prototype, "bottom", {
        get: function () {
            return this.yPos + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Ship.prototype.moveRight = function () {
        if (this.right < this.windowWidth) {
            this.addDirectionHistory(MoveDirections.Right);
        }
    };
    Ship.prototype.moveLeft = function () {
        if (this.left > 0) {
            this.addDirectionHistory(MoveDirections.Left);
        }
    };
    Ship.prototype.moveUp = function () {
        if (this.top > 0) {
            this.addDirectionHistory(MoveDirections.Up);
        }
    };
    Ship.prototype.moveDown = function () {
        if (this.bottom < this.windowHeight) {
            this.addDirectionHistory(MoveDirections.Down);
        }
    };
    Ship.prototype.shiftPosition = function () {
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
    var stars = [];
    var shipImg;
    var asteroidImages = [];
    var asteroid1;
    var asteroidLimit;
    p.preload = function () {
        shipImg = p.loadImage(SHIP_IMG);
        asteroidLimit = ASTEROIDS_MAX;
        ASTEROID_TYPES.forEach(function (img) {
            asteroidImages.push(p.loadImage(img));
        });
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
        handleStars();
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
        asteroids.forEach(function (a) {
            a.draw(p, asteroidImages[a.type]);
            a.move(p);
        });
    }
    function handleStars() {
        while (stars.length < STARS_MAX) {
            stars.push(new Star(p));
        }
        stars.forEach(function (s) {
            s.draw(p);
            s.move();
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
    function Star(p) {
        this.width = p.random(15, 60);
        this.height = p.random(1, 2);
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.xPos = p.random(0, this.windowWidth);
        this.yPos = p.random(-100, this.windowHeight);
        this.speed = p.random(10, 30);
    }
    Star.prototype.draw = function (p) {
        p.push();
        p.fill(80);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    };
    Star.prototype.move = function () {
        this.xPos = this.xPos - this.speed;
        if (this.xPos < 0) {
            this.xPos = this.windowWidth;
        }
    };
    return Star;
}());
function isOutOfBounds(left, top, right, bottom, windowWidth, windowHeight) {
    return (left < 0 || right > windowWidth || top < 0 || bottom > windowHeight);
}
//# sourceMappingURL=build.js.map