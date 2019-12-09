const accel = 0.9;
const gravity = 0.;
const bounce = -1.1;

function handleExplosions(p: p5, explosionParticles: IExplosionParticle[]): IExplosionParticle[] {
    for (var i = 0; i < explosionParticles.length; i++) {
        var point = explosionParticles[i]; // get a blob from the list

        if (point.y > 100 || point.y < 0) { // bounce! NB || is "OR"
            point.yDrift = point.yDrift * bounce; // use the bounce variable
        }

        if (point.x > 100 || point.x < 0) { // bounce! NB || is "OR"
            point.xDrift = point.xDrift * bounce; // use the bounce variable
        }

        var diam = 2 + 40 / point.age;
        p.push();
        p.fill(point.color);
        p.ellipse(point.x, point.y, diam, diam);
        p.pop();

        point.x += point.xDrift;
        point.y += point.yDrift;
        point.xDrift = point.xDrift * accel; // accelerate your drift
        point.yDrift = point.yDrift * accel; // accelerate your drift
        point.yDrift = point.yDrift + gravity;
        point.age++; // increase your 'age' counter
    }

    return explosionParticles.filter(e => e.age < 10);
}