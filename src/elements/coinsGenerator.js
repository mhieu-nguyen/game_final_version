var gaussianRandom = function(mean, std){
    const u = 1-Math.random();
    const v = Math.random();

    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z*std + mean;
}

var scene1chests = Array(25).fill(0);
var scene2chests = Array(25).fill(0);
var scene3chests = Array(25).fill(0);
var scene4chests = Array(25).fill(0);

for (let i = 0; i<9; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(300/8,5);
    }
    scene1chests[i] = coin.toFixed(2);
}

for (let i = 11; i<22; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(300/11,5);
    }
    scene1chests[i] = coin.toFixed(2);
}

for (let i = 0; i<10; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(400/10,8);
    }
    scene2chests[i] = coin.toFixed(2);
}

for (let i = 12; i<20; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(500/8,15);
    }
    scene2chests[i] = coin.toFixed(2);
}

for (let i = 22; i<25; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(500/3,20);
    }
    scene2chests[i] = coin.toFixed(2);
}

for (let i = 0; i<8; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(400/7,10);
    }
    scene3chests[i] = coin.toFixed(2);
}

for (let i = 10; i<15; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(700/5,20);
    }
    scene3chests[i] = coin.toFixed(2);
}

for (let i = 17; i<23; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(700/6,20);
    }
    scene3chests[i] = coin.toFixed(2);
}

scene3chests[24] = 600;

for (let i = 0; i<8; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(500/7,15);
    }
    scene4chests[i] = coin.toFixed(2);
}

for (let i = 11; i<17; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(900/6,30);
    }
    scene4chests[i] = coin.toFixed(2);
}

for (let i = 19; i<24; i++){
    var coin = 0;
    while (coin<=0){
        coin = gaussianRandom(1100/5,40);
    }
    scene4chests[i] = coin.toFixed(2);
}
console.log(scene1chests);
console.log(scene2chests);
console.log(scene3chests);
console.log(scene4chests);

var preVar = function(){
    var velocityIncrease = 0; var sizeIncrease = 0;

    while (velocityIncrease<=0) {
        velocityIncrease = gaussianRandom(5,0.2);
    };

    while (sizeIncrease <=0 ) {
        sizeIncrease = gaussianRandom(0.15,0.01);
    };
    return [velocityIncrease, sizeIncrease];
}

var pVar1; 
pVar1 = preVar();
var pVar2; 
pVar2 = preVar();
var pVar3; 
pVar3 = preVar();
var pVar4; 
pVar4 = preVar();

console.log(pVar1)
console.log(pVar2)
console.log(pVar3)
console.log(pVar4)
