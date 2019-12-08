function showScoreBoardInfo(p: p5, ship: Ship) {
    showHealth(p, ship);
    showScore(p, ship);
}
function showHealth(p: p5, ship: Ship) {
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
function showScore(p: p5, ship: Ship) {
    p.textSize(15);
    p.text('SCORE: ' + ship.score, 30, 100);
    p.pop();
}