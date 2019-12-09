var SPACEBAR = 32;
var UP_ARROW = 38;
var LEFT_ARROW = 37;
var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var ASTEROIDS_MAX = 30;
var STARS_MAX = 20;
var BACKGROUND = 20;
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
var sketch = function (p) {
    var ship;
    var missiles = [];
    var asteroids = [];
    var stars = [];
    var explostionParticles = [];
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
        ship = new Ship(p);
    };
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = function () {
        renderStaticBackgroundLayer();
        renderDynamicBackgroundLayer();
        renderAll();
        handleKeyboardInput();
    };
    function renderStaticBackgroundLayer() {
        p.background(BACKGROUND);
        p.push();
        p.stroke(255);
        for (var index = 0; index < 15; index++) {
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
        missiles = missiles.filter(function (m) { return m.yPos <= p.windowHeight && !m.isDestroyed; });
        missiles.forEach(function (missle) {
            missle.draw(p);
            missle.move();
        });
    }
    function handleCollisions() {
        missiles.filter(function (m) { return !m.isDestroyed; }).forEach(function (missile) {
            asteroids.forEach(function (asteroid) {
                if (missile.collidesWith(asteroid)) {
                    asteroid.reset(p);
                    missile.destroy();
                    ship.score++;
                    addBasicExplosion(missile.tip.xPos, missile.tip.yPos);
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
    function addBasicExplosion(xPos, yPos) {
        for (var i = 0; i < 20; i++) {
            explostionParticles.push(new BasicExplosionParticle(p, xPos, yPos));
        }
    }
};
var sketchP = new p5(sketch);
function isOutOfBounds(left, top, right, bottom, windowWidth, windowHeight) {
    return (left < 0 || right > windowWidth || top < 0 || bottom > windowHeight);
}
var Asteroid = (function () {
    function Asteroid(p, type) {
        this.type = type;
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.reset(p);
    }
    Object.defineProperty(Asteroid.prototype, "top", {
        get: function () {
            return this.yPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Asteroid.prototype, "left", {
        get: function () {
            return this.xPos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Asteroid.prototype, "right", {
        get: function () {
            return this.xPos + this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Asteroid.prototype, "bottom", {
        get: function () {
            return this.yPos + this.size;
        },
        enumerable: true,
        configurable: true
    });
    Asteroid.prototype.move = function (p) {
        this.xPos = this.xPos - this.speed;
        if (this.xPos < 0) {
            this.reset(p);
        }
    };
    Asteroid.prototype.reset = function (p) {
        this.xPos = p.random(this.windowWidth + 100, this.windowWidth + 300);
        this.yPos = p.random(0, this.windowHeight);
        this.size = p.random(30, 60);
        this.speed = p.random(1, 5);
    };
    Asteroid.prototype.draw = function (p, image) {
        p.image(image, this.xPos, this.yPos, this.size, this.size);
    };
    return Asteroid;
}());
var BasicExplosionParticle = (function () {
    function BasicExplosionParticle(p, xPos, yPos) {
        this.x = xPos + p.random(-2, 2);
        this.y = yPos + p.random(-2, 2);
        this.xDrift = p.random(-30, 30),
            this.yDrift = p.random(-30, 30),
            this.age = 1;
        this.color = p.random(200, 255);
    }
    return BasicExplosionParticle;
}());
var Missle = (function () {
    function Missle(ship) {
        this.width = 20;
        this.height = 2;
        this.speed = 20;
        this.isDestroyed = false;
        this.xPos = ship.xPos + ship.width;
        this.yPos = ship.yPos + (ship.width / 2);
    }
    Missle.prototype.draw = function (p) {
        p.push();
        p.noStroke();
        p.fill(255, 69, 0);
        p.ellipse(this.xPos, this.yPos, this.width, this.height);
        p.pop();
    };
    Missle.prototype.move = function () {
        this.xPos = this.xPos + this.speed;
    };
    Object.defineProperty(Missle.prototype, "tip", {
        get: function () {
            return new Point(this.xPos + (this.width / 2), this.yPos);
        },
        enumerable: true,
        configurable: true
    });
    Missle.prototype.collidesWith = function (asteroid) {
        var x = this.xPos + (this.width / 2);
        var y = this.yPos;
        return x >= asteroid.left &&
            x <= asteroid.right &&
            y >= asteroid.top &&
            y <= asteroid.bottom;
    };
    Missle.prototype.destroy = function () {
        this.isDestroyed = true;
    };
    return Missle;
}());
var Point = (function () {
    function Point(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
    return Point;
}());
var Ship = (function () {
    function Ship(p) {
        this.width = 75;
        this.height = 75;
        this.lastDirections = [];
        this.score = 0;
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
var Star = (function () {
    function Star(p) {
        this.width = p.random(40, 60);
        this.height = p.random(1, 2);
        this.windowHeight = p.windowHeight;
        this.windowWidth = p.windowWidth;
        this.xPos = p.random(0, this.windowWidth);
        this.yPos = p.random(-100, this.windowHeight);
        this.speed = p.random(10, 30);
    }
    Star.prototype.draw = function (p) {
        p.push();
        p.noStroke();
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
var accel = 0.9;
var gravity = 0.;
var bounce = -1.1;
function handleExplosions(p, explosionParticles) {
    for (var i = 0; i < explosionParticles.length; i++) {
        var point = explosionParticles[i];
        if (point.y > 100 || point.y < 0) {
            point.yDrift = point.yDrift * bounce;
        }
        if (point.x > 100 || point.x < 0) {
            point.xDrift = point.xDrift * bounce;
        }
        var diam = 2 + 40 / point.age;
        p.push();
        p.fill(point.color);
        p.ellipse(point.x, point.y, diam, diam);
        p.pop();
        point.x += point.xDrift;
        point.y += point.yDrift;
        point.xDrift = point.xDrift * accel;
        point.yDrift = point.yDrift * accel;
        point.yDrift = point.yDrift + gravity;
        point.age++;
    }
    return explosionParticles.filter(function (e) { return e.age < 10; });
}
function showScoreBoardInfo(p, ship) {
    showHealth(p, ship);
    showScore(p, ship);
}
function showHealth(p, ship) {
    p.push();
    p.rect(25, 25, 100, 50);
    p.fill(255, 200, 0);
    p.rect(25, 25, ship.health, 50);
    p.pop();
    p.push();
    p.fill(255);
    p.textSize(20);
    p.text(ship.health + '%', 30, 50);
}
function showScore(p, ship) {
    p.textSize(15);
    p.text('SCORE: ' + ship.score, 30, 100);
    p.pop();
}
//# sourceMappingURL=build.js.map