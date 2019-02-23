var Morph = (function () {
    function Morph() {
    }
    Morph.prototype.setup = function (p) {
        this.shapes = [];
        this.currentShape = 0;
        this.shapes.push({ points: Shapes.circle(p, 100), color: p.color('#009CDF') });
        this.shapes.push({ points: Shapes.circle(p, 150), color: p.color(255, 204, 0) });
        this.shapes.push({ points: Shapes.square(p, 50), color: p.color(175, 100, 220) });
        this.morph = new Array();
        var highestCount = 0;
        for (var i = 0; i < this.shapes.length; i++) {
            highestCount = Math.max(highestCount, this.shapes[i].points.length);
        }
        for (var i = 0; i < highestCount; i++) {
            this.morph.push(new p5.Vector());
        }
    };
    Morph.prototype.recalc = function (p) {
        var totalDistance = 0;
        var points = this.shapes[this.currentShape].points;
        for (var i = 0; i < points.length; i++) {
            var v1 = points[i];
            var v2 = this.morph[i];
            v2.lerp(v1, 0.1);
            totalDistance += p5.Vector.dist(v1, v2);
        }
        if (totalDistance < 0.1) {
            this.currentShape++;
            if (this.currentShape >= this.shapes.length) {
                this.currentShape = 0;
            }
        }
    };
    Morph.prototype.draw = function (p) {
        this.recalc(p);
        var color = this.shapes[this.currentShape].color;
        var points = this.shapes[this.currentShape].points;
        p.translate(p.width / 2, p.height / 2);
        p.strokeWeight(4);
        p.beginShape();
        p.noFill();
        p.stroke(color);
        for (var i = 0; i < points.length; i++) {
            var v = this.morph[i];
            p.vertex(v.x, v.y);
        }
        p.endShape(p.CLOSE);
    };
    return Morph;
}());
var Shapes = (function () {
    function Shapes() {
    }
    Shapes.circle = function (p, size) {
        var points = new Array();
        for (var angle = 0; angle < 360; angle += 9) {
            var v = p5.Vector.fromAngle(p.radians(angle - 135));
            v.mult(size);
            points.push(v);
        }
        return points;
    };
    Shapes.square = function (p, size) {
        var points = new Array();
        for (var x = -size; x < size; x += 10) {
            points.push(p.createVector(x, -size));
        }
        for (var y = -size; y < size; y += 10) {
            points.push(p.createVector(size, y));
        }
        for (var x = size; x > -size; x -= 10) {
            points.push(p.createVector(x, size));
        }
        for (var y = size; y > -size; y -= 10) {
            points.push(p.createVector(-size, y));
        }
        return points;
    };
    Shapes.star = function (p, x, y, radius1, radius2, npoints) {
        var angle = p.TWO_PI / npoints;
        var halfAngle = angle / 2.0;
        var points = new Array();
        for (var a = 0; a < p.TWO_PI; a += angle) {
            var sx = x + p.cos(a) * radius2;
            var sy = y + p.sin(a) * radius2;
            points.push(p.createVector(sx, sy));
            sx = x + p.cos(a + halfAngle) * radius1;
            sy = y + p.sin(a + halfAngle) * radius1;
            points.push(p.createVector(sx, sy));
        }
        return points;
    };
    return Shapes;
}());
var SPACEBAR = 32;
var UP_ARROW = 38;
var LEFT_ARROW = 37;
var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var STARS_LIMIT = 500;
var sketch = function (p) {
    var ship;
    var missiles = [];
    var stars = [];
    p.preload = function () {
    };
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noStroke();
        ship = new Ship(p.windowWidth / 2, p.windowHeight / 2);
    };
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    p.draw = function () {
        p.background(42);
        renderAll();
        handleArrowKeys();
    };
    function renderAll() {
        ship.draw(p);
        showHealth();
        handleMissles();
        handleStars();
    }
    function handleMissles() {
        missiles = missiles.filter(function (m) { return m.yPos <= p.windowHeight; });
        missiles.forEach(function (missle) {
            missle.yPos = missle.yPos - 20;
            missle.draw(p);
        });
    }
    function handleStars() {
    }
    p.keyPressed = function () {
        console.log(p.keyCode);
        if (p.keyCode === SPACEBAR) {
            missiles.push(new Missle(ship.xPos + p.random(0, 3), ship.yPos));
        }
    };
    function handleArrowKeys() {
        if (p.keyIsDown(UP_ARROW)) {
            ship.yPos = ship.yPos - 5;
        }
        if (p.keyIsDown(DOWN_ARROW)) {
            ship.yPos = ship.yPos + 5;
        }
        if (p.keyIsDown(LEFT_ARROW)) {
            ship.xPos = ship.xPos - 5;
        }
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
};
var sketchP = new p5(sketch);
var Ship = (function () {
    function Ship(x, y) {
        this.xPos = x;
        this.yPos = y;
        this.health = 100;
    }
    Ship.prototype.draw = function (p) {
        p.triangle(this.xPos + Ship.width, this.yPos + Ship.height, this.xPos - Ship.width, this.yPos + Ship.height, this.xPos, this.yPos - Ship.height);
    };
    Ship.height = 25;
    Ship.width = 20;
    return Ship;
}());
var Asteroid = (function () {
    function Asteroid(x, y, size) {
        this.xPos = x;
        this.yPos = y;
        this.size = size;
    }
    Asteroid.prototype.draw = function (p) {
        p.ellipse(this.xPos, this.yPos, this.size, this.size);
    };
    return Asteroid;
}());
var Missle = (function () {
    function Missle(x, y) {
        this.xPos = x;
        this.yPos = y;
    }
    Missle.prototype.draw = function (p) {
        p.push();
        p.fill(255, 69, 0);
        p.ellipse(this.xPos, this.yPos, 3, 20);
        p.pop();
    };
    return Missle;
}());
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