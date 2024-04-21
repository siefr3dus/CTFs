var seedrandom = require('seed-random');

for (let step = 0; step < 60; step++) {
    var random = seedrandom(step);
    var a = Math.floor(random() * (6 - 1)) + 1;
    var b = Math.floor(random() * (6 - 1)) + 1;
    var c = Math.floor(random() * (6 - 1)) + 1;
    if (a == b && a == c){
        console.log(step, a, b, c);
    }
}
