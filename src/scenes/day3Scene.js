//scene to hold the task, in first context A. routes to 'next stage' scene 1

//import js game element modules (sprites, ui, outcome animations, etc.)
import Player from "../elements/player.js";
import Predator3 from "../elements/predator3.js";
import Chest from "../elements/chest.js";
import RatingPanel from "../elements/ratingPanel.js";
import KeepCoin from "../elements/keepCoin.js";
import LoseCoin from "../elements/loseCoin.js";

var outcomeDuration=1500;
var nChests=25;
const eventsCenter = new Phaser.Events.EventEmitter();
//this function extends Phaser.Scene and includes the core logic for the game
export default class day3Scene extends Phaser.Scene {
    constructor(key) {
        super({
            key: key
        });
        this.chestEncountered = new Array(nChests).fill(false);
        this.rateWindow = new Array(nChests).fill(false);
        this.keyTimes = [];
        this.distance = [];
        this.speed = [];
        this.timeBetweenChests = [];
        this.scene3KeyPresses = [];
        this.decisionTimes = [];
        this.chestOn = [];
        this.keepcoinOn = 0;
        this.chestCount = 0;
        this.moving = true;
        this.chestTriggered=false;
        this.predatorTriggered = false;
        this.caught = false;
        this.velocity = 250; this.velocityIncrease = 0;
        this.preSize = 2; this.sizeIncrease = 0;
        this.timecheck = false;
        this.warning = false;
        this.coinloss = 0;
    }

    preload() {
        ////////////////////PRELOAD GAME ASSETS///////////////////////////////////
        // load tilemap and tileset created using Tiled 
        this.load.tilemapTiledJSON('map3', './assets/tilemaps/winter2.json'); 
        this.load.image('tiles3', './assets/tilesets/winter.png');
        this.load.image("imageBG3", "./assets/tilesets/winterBG.png");
        

        // load player sprite
        this.load.spritesheet('player', './assets/spritesheets/explorer.png', { 
            frameWidth: 101, 
            frameHeight: 110 
        });

        // load predator sprite
        this.load.spritesheet('predator3', './assets/spritesheets/troll2.png', {
            frameWidth: 103, 
            frameHeight: 65 
        });

        // load robot sprites
        this.load.spritesheet('chest', './assets/spritesheets/treasure.png', { 
            frameWidth: 35, 
            frameHeight: 32
        });

        // load coin sprite
        this.load.spritesheet('coin', './assets/spritesheets/coin.png', { 
            frameWidth: 15.8, 
            frameHeight: 16 
        });

        this.load.json('chestcoins', './assets/chestcoinsTest.json');
        this.load.json('pVariables', './assets/predatorVariablesTest.json')
    }
    
    create() {
        ////////////////////////CREATE WORLD//////////////////////////////////////
        //game world created in Tiled (https://www.mapeditor.org/) using pixel art sourced from from Open Game Art (https://opengameart.org/)
        // create tilemap
        var map = this.make.tilemap({ key: "map3" });
        var tileset = map.addTilesetImage("winter", "tiles3"); //first arg is name you gave the tileset in Tiled
        this.add.sprite(0,0,'imageBG3').setOrigin(0,0).setScrollFactor(0);

        // set some size scaling variables as our tilemap is big!
        this.gameHeight = this.sys.game.config.height;
        this.gameWidth = this.sys.game.config.width;
        this.mapHeight = map.heightInPixels;
        this.mapWidth = map.widthInPixels;
        this.sf = this.mapHeight/this.gameHeight;
        const displayWidth = this.mapWidth/this.sf;
        
        // set up scene layers using names set up in Tiled      

        this.platforms = map.createDynamicLayer("platform", tileset, 0, 0)
        this.platforms.displayHeight = this.gameHeight;
        this.platforms.displayWidth = displayWidth;

        const TileLayer4 = map.createDynamicLayer("TileLayer4", tileset, 0, 0)
        TileLayer4.displayHeight = this.gameHeight;
        TileLayer4.displayWidth = displayWidth;  
        

        const TileLayer3 = map.createDynamicLayer("TileLayer3", tileset, 0, 0)
        TileLayer3.displayHeight = this.gameHeight;
        TileLayer3.displayWidth = displayWidth;  
        

        const TileLayer2 = map.createDynamicLayer("TileLayer2", tileset, 0, 0)
        TileLayer2.displayHeight = this.gameHeight;
        TileLayer2.displayWidth = displayWidth;
        

        const TileLayer1 = map.createDynamicLayer("TileLayer1", tileset, 0, 0)
        TileLayer1.displayHeight = this.gameHeight;
        TileLayer1.displayWidth = this.mapWidth/this.sf;

        // set up 'collides' property for platform tiles (set in Tiled)
        this.platforms.setCollisionByProperty({ collides: true });


        
        //this.pTriggerPoint = [];
        
        //for (let i=0; i<4; i++){
        //    const pTP = map.findObject("Object Layer 1", obj => obj.name === `predator_appear_${i}`);

        //    this.pTriggerPoint[i] = this.physics.add.sprite(pTP.x/this.sf, pTP.y/this.sf);
        //    this.pTriggerPoint[i].displayHeight = this.gameHeight*2; //hack
        //    this.pTriggerPoint[i].immovable = true;
        //    this.pTriggerPoint[i].body.moves = false;
        //    this.pTriggerPoint[i].allowGravity = false;
        //}
    
        this.predatorEntryPoint = map.findObject("Object Layer 1", obj => obj.name === 'predator');
        
        this.chestEntryPoint = [];
        this.chest = [];
        const rTP = map.findObject("Object Layer 1", 
                                        obj => obj.name === `chest_appear`);
        this.chestTriggerPoint = this.physics.add.sprite(rTP.x/this.sf, rTP.y/this.sf);
        this.chestTriggerPoint.displayHeight = this.gameHeight*2; //hack
        this.chestTriggerPoint.immovable = true;
        this.chestTriggerPoint.body.moves = false;
        this.chestTriggerPoint.allowGravity = false;
        this.chestOn.length = nChests; this.chestOn.fill(0);
        
        
        

        for (let i=0; i<25; i++){
            this.chestEntryPoint[i] = map.findObject("Object Layer 1", obj => obj.name === `chest_enter_${i+1}`);
            this.chest[i] = new Chest(this, this.chestEntryPoint[i].x/this.sf, this.chestEntryPoint[i].y/this.sf, 
                                this.chestOn[i]); 
            this.physics.add.collider(this.chest[i].sprite, this.platforms);
        };

        
        
        // set the boundaries of the world
        this.physics.world.bounds.width = this.mapWidth/this.sf;
        this.physics.world.bounds.height = this.gameHeight;
        
        //////////////ADD PLAYER AND PREDATOR SPRITE///////
        this.predator = new Predator3(this, this.predatorEntryPoint.x/this.sf, 200);
        this.physics.add.collider(this.predator.sprite, this.platforms);

        this.player = new Player(this, 0, 300); //(this, spawnPoint.x, spawnPoint.y);
        this.physics.add.collider(this.player.sprite, this.platforms); //player walks on this.platforms
        //////////////CONTROL CAMERA///////////////////////
        this.cameras.main.startFollow(this.player.sprite); //camera follows player
        this.cameras.main.setBounds(0, 0, this.mapWidth/this.sf, this.gameHeight);
        
        

        ///////////FIXED INSTRUCTIONS TEXT/////////////////
        //add help text that has a "fixed" position on the screen

        this.instruction = 'To [b][color=#0E86D4]Open[/color][/b]: press [b][color=#0E86D4]SPACE BAR[/color][/b].\n'+
                           'To [b][color=#FF0000]Exit[/color][/b]: press [b][color=#FF0000]X[/color][/b].';

        createDialog(this, this.instruction, 'left', '18px')
        .setPosition(155, 565)
        .layout()
        .popUp(0)
        .setScrollFactor(0); 

        this.add
            .text(305, 553, "press RIGHT ARROW KEY to explore the snowfield!", {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);  
        this.add
            .text(this.gameWidth-770, 50, "Current speed", {
                font: "14px monospace",
                fill: "#000000",
                strokeThickness: 1
            })
            .setScrollFactor(0);
        //this.add
        //    .text(this.gameWidth-750, 560, "Ogre's speed", {
        //        font: "14px monospace",
        //        fill: "#ffffff"
        //    })
        //    .setScrollFactor(0); 
        this.message = '[b][color=#FF0000]WARNING[/color][/b]!!!\n'+
        'Ogre is too close. You are [b][color=#FF0000]losing coins[/color][/b].\n'+
        '[b][color=#FF0000]Increase your speed[/color][/b]!';
        this.warningMessage = createDialog(this, this.message, 'center','18px')
        .setPosition(400, 200)
        .layout()
        .popUp(0)
        .setScrollFactor(0); 

        //////////////////////////CONTROL GAME SEQUENCE///////////////////////////
        //1. check for collision between player and chest trigger point and predator trigger points:
        this.physics.add.collider(this.player.sprite, this.chestTriggerPoint, 
                                        function(){ eventsCenter.emit('chestTriggered');}, null, this); 
        eventsCenter.once('chestTriggered',chestEnter,this);
        
        //this.physics.add.overlap(this.player.sprite, this.pTriggerPoint, 
        //                                predatorEnter, null, this);
    
        //2. check for overlap between player and chests:
        for (let i=0; i<25; i++){
            this.physics.add.overlap(this.player.sprite, this.chest[i].sprite, 
                                    chestEncounter  , null, this);
            };

        let totalChests = this.cache.json.get("chestcoins");
        this.scene3chests = totalChests.scene3chests;

        let pVariables = this.cache.json.get("pVariables");
        this.velocityIncrease = pVariables.pVar3[0];
        this.sizeIncrease = pVariables.pVar3[1];

        this.registry.set('keyCount', 0);
        this.registry.set('velocity', this.velocity);
        this.registry.set('pVelocity', this.velocity);
        this.registry.set('velocityIncrease', this.velocityIncrease);

        this.nCoins = this.registry.get('coinsTotal');
        this.oldVelocity = this.velocity;
        this.oldOgreVelocity = this.velocity;
        
        this.currentProgress = this.add.graphics();
        this.currentProgress.fillStyle(0x009900);
        this.currentProgress.fillRect(this.gameWidth-770, 30, 400*(this.registry.get('velocity'))/2000 ,20); 
        this.currentProgress.setScrollFactor(0);

        //this.ogreSpeed = this.add.graphics();
        //this.ogreSpeed.fillStyle(0xFF0000);
        //this.ogreSpeed.fillRect(this.gameWidth-750, 540, 400*(this.registry.get('pVelocity'))/1000 ,20); 
        //this.ogreSpeed.setScrollFactor(0);

        this.timer = 0;
    }
    
    update(time, delta) {

        var distance = this.player.sprite.body.position.x-this.predator.sprite.body.position.x;
        if (distance>=400 && !this.predatorTriggered){
            this.predatorTriggered = true;
        }

        if (distance>=280 || this.chestCount == 9 || this.chestCount == 16 || this.chestCount == 23){
            this.getting_close = false;
        }
        else if(distance<=180){
            this.getting_close = true;
        }

        if (!this.timecheck){
            this.lastChestTime = this.time.now;
            this.trialStartTime = this.time.now;
            this.timecheck=true;
        }

        this.player.update(this.moving, this.chestCount, this.getting_close);  
        this.predator.update(this.predatorTriggered, this.moving, this.preSize, this.getting_close, delta);
        
        if (this.moving){
            if (this.predatorTriggered && distance<=190){
                this.timer+=delta;
                this.warning = true;
                if (this.timer>=1000){
                    if (this.nCoins>10){
                        this.nCoins -= 10;
                        this.coinloss += 10;
                    }
                    else {
                        this.coinloss += 10;
                        this.nCoins = 0;
                    }
                    this.timer -= 1000;
                    if (this.coinloss == 80){
                        this.warning = false;
                        getCaught(this);
                    }
                }
            }
            else {
                this.warning = false;
            }

            if (this.warning){
                this.warningMessage.visible = true;
            }
            else{
                this.coinloss = 0;
                this.warningMessage.visible = false;    
            }
        }
        //coins tracker/update
        this.scoreText = this.add
            .text(this.gameWidth-230, 16, "Coins: " + Number(this.nCoins).toFixed(2) +
            '\nGoal: 1000', {
                font: "24px monospace",
                fill: "#FFD700",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);
    
        if (this.registry.get('velocity') != this.oldVelocity){
            this.currentProgress.destroy();
            this.currentProgress = this.add.graphics();
            this.currentProgress.fillStyle(0x009900);
            this.currentProgress.fillRect(this.gameWidth-770, 30, 400*(this.registry.get('velocity'))/2000 ,20); 
            this.currentProgress.setScrollFactor(0);
            this.oldVelocity = this.registry.get('velocity');
        };
        
        //if (this.registry.get('pVelocity') != this.oldOgreVelocity){
        //    this.ogreSpeed.destroy();
        //    this.ogreSpeed = this.add.graphics();
        //    this.ogreSpeed.fillStyle(0xFF0000);
        //    this.ogreSpeed.fillRect(this.gameWidth-750, 540, 400*(this.registry.get('pVelocity'))/1000 ,20); 
        //    this.ogreSpeed.setScrollFactor(0);
        //    this.oldOgreVelocity = this.registry.get('pVelocity');
        //};
    }
    
    nextScene() {
        this.cache.task1_data.trial_no.push(this.cache.trial_no);
        this.cache.task1_data.environment.push(3);

        this.cache.task1_data.Chest_Open.push(this.chestCount);
        this.cache.task1_data.Time_Between_Chests.push(this.timeBetweenChests);
        this.cache.task1_data.Decision_Times.push(this.decisionTimes);
        
        this.cache.task1_data.Key_Presses.push(this.scene3KeyPresses);
        this.cache.task1_data.Key_Times.push(this.keyTimes);
        this.cache.task1_data.Distance.push(this.distance);
        this.cache.task1_data.Speed.push(this.speed);

        this.cache.task1_data.Total_Time.push(Math.round(this.time.now-this.trialStartTime));
        this.cache.task1_data.Total_coins.push(this.nCoins);
        
        this.registry.set('coinsTotal', this.nCoins);     //log total coins collected to pass to next scene
        this.player.destroy();
        this.predator.destroy();
       
        let csv = '';
        let header = Object.keys(this.cache.task1_data);
        csv = csv + header.join(',') +'\n';
        let data_length = this.cache.task1_data.trial_no.length;
        for (let i=0; i<data_length; i++){
            for (let j=0; j<header.length;j++){
                if (this.cache.task1_data[header[j]][i] != null){
                    csv += `"${this.cache.task1_data[header[j]][i]}"`
                    if (j<(header.length-1)) {
                        csv +=',';
                    }
                }
            }
            csv += '\n';
        }
        const upload = async function (csv,filepath){
            try{
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');

                const apiResult = await fetch(
                        "https://qsj3v6s9ig.execute-api.us-east-1.amazonaws.com/default/avoidance-learning-task",
                            { headers: headers,
                              method: "POST",
                              body: JSON.stringify({result:csv, filepath: filepath}),
                            }
                );
                console.log(apiResult.status);
                console.log(await apiResult.text());
                }catch (error) {console.error("Error:", error);}}

        var date = new Date();
        var month = date.getMonth()+1;       
        var filepath = `data/subject_${this.cache.subID}/${this.cache.subID}_${date.getDate()}_${month}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_env3_trial_${this.cache.trial_no}.csv`;
        upload(csv, filepath);

        if (this.nCoins>=1000){
            this.scene.start('Ending_Win');
        }
        else{
        
            let key = `day3Scene_${this.cache.trial_no}`;
            var scene7 = new day3Scene(key);
            this.game.scene.add(key, scene7);
            this.scene.start('SummaryDay3');
        };
    }
    
}

///////////////DEFINE GAME SEQUENCE FUNCTIONS/////////////////////////////////////
//1. when player hits robo trigger point, enter robot
var chestEnter = function () {
        this.chestOn.fill(1);
   
};
var getCaught = function(scene) {
    scene.warningMessage.visible = false;
    scene.losecoins = new LoseCoin(scene, scene.player.sprite.x+10, 250);
    scene.physics.add.collider(scene.losecoins.sprite, scene.platforms);
    scene.player.sprite.body.moves = false; 
    scene.moving = false;
    scene.predator.sprite.visible = false;
    scene.predator.sprite.body.moves = false; 
    scene.preSize = 2;
    scene.predatorTriggered = false;

    scene.feedback = scene.add.text(scene.player.sprite.x-270, 150, 
        "Oh no!\nYou got caught by the ogre!\n" +
        "He has robbed you of all your coins.", {
       font: "24px monospace",
       fill: "#ffffff",
       align: 'center',
       padding: { x: 20, y: 10 },
       backgroundColor: "#000000"
       });
    
    scene.nCoins = 0;       
    scene.time.addEvent({delay: 1500, callback:coinloss_event, args:[scene]}) 
}
var coinloss_event = function(scene){
    scene.feedback.destroy();
    scene.losecoins.destroy();
    scene.player.sprite.body.moves = true; 
    scene.moving = true;
}
var endChestEncounter = function(scene, chestCount) {
    scene.feedback.destroy();
    scene.chest[chestCount].destroy();
    if (this.warning){
        this.warningMessage.visible = true;
    }

    if (scene.caught){
        scene.predator.sprite.visible = false;
        scene.predator.sprite.body.moves = false; 
        scene.preSize = 2;
        scene.caught = false;
        scene.predatorTriggered = false;
    }
   
    scene.lastChestTime = scene.time.now;
    if (scene.keepcoins!=null) {
        scene.keepcoins.destroy();
    };      
    if (scene.losecoins!=null) {
        scene.losecoins.destroy();
    };

    scene.player.sprite.body.moves = true; 
    scene.moving = true;
};
//2. when player encounters chest, pop up ratings dialog
var chestEncounter =  function() {
    if (!this.chestEncountered[this.chestCount]) {
        this.chestEncountered[this.chestCount] = true;
        this.player.sprite.body.moves = false; 
        this.moving = false;
        this.warningMessage.visible = false;
        this.keepcoinOn = 0;
        this.timeBetweenChests[this.chestCount] = Math.round(this.time.now - this.lastChestTime);
                
        if (!this.rateWindow[this.chestCount]) {
            this.rateWindow[this.chestCount] = true; 
            this.panelX = this.player.sprite.x+10;

            this.ratingPanel = new RatingPanel(this, this.panelX, 160, this.scene3chests[this.chestCount], 25);
            this.panelTime = this.time.now;
                                  //only pops up once per trial 
            this.scene3KeyPresses[this.chestCount] = this.registry.get('keyCount');
            
            //display outcome after ratings completed:
            this.events.once('ratingcomplete', function () {
                this.decisionTimes[this.chestCount] = Math.round(this.time.now - this.panelTime);
                this.keyTimes[this.chestCount] = this.registry.get('keyTimes');
                this.distance[this.chestCount] = this.registry.get('distance');
                this.speed[this.chestCount] = this.registry.get('speed');
                this.registry.set('keyCount',0);

                this.coin = this.registry.get('coins');
                if (this.coin >= 0 ) {
                    this.chestOn[this.chestCount] = 2;         
                    this.keepcoinOn = 1;       
                    this.keepcoins = new KeepCoin(this, this.panelX, 100, this.keepcoinOn);
                    this.keepcoins.update(this.keepcoinOn);
                    this.chest[this.chestCount].update(this.chestOn[this.chestCount]);
                    if (this.coin == 0) {
                        this.chestmessage = "Unfortunately, this chest is [color=#FF0000][b]EMPTY[/color][/b]!"
                        this.feedback = createDialog(this, this.chestmessage, 'center', '24px')
                                        .setPosition(400, 180)
                                        .layout()
                                        .popUp(0)
                                        .setScrollFactor(0);
                    }
                    else{
                        this.chestmessage = "[b][color=#0BDA51]CONGRATULATION[/color][/b]!\n" +
                                            `You have found additional [b][color=#FFFF00]${Number(this.scene3chests[this.chestCount]).toFixed(2)} coins[/color][/b]!`;
                        this.feedback = createDialog(this, this.chestmessage, 'center', '24px')
                                        .setPosition(400, 180)
                                        .layout()
                                        .popUp(0)
                                        .setScrollFactor(0); 
                        }
                    this.nCoins = this.nCoins + this.coin;
                                                            
                    let timer = this.time.addEvent({delay: outcomeDuration, 
                                                    callback: endChestEncounter,
                                                    args: [this, this.chestCount],
                                                    });   

                    
                    
                    
                    this.registry.set('pVelocity', this.registry.get('pVelocity') + this.velocityIncrease);  
                    
                    if (this.preSize < 3){
                        this.preSize += this.sizeIncrease;  
                    }

                    this.chestCount++;
                    if (this.nCoins>=1000 || this.chestCount == 25){
                        this.nextScene();
                    };   
                }

                if (this.coin == -1){
                    this.caught = true;
                    this.losecoins = new LoseCoin(this, this.panelX, 250);
                    this.physics.add.collider(this.losecoins.sprite, this.platforms);

                    this.chestOn[this.chestCount] = 2;  
                    this.chest[this.chestCount].update(this.chestOn[this.chestCount]);

                    this.chestmessage = "[b][color=#FF0000]OH NO![/color][/b]\n"+
                                        "You got caught by the ogre!\n" +
                                        "He has robbed you of [b][color=#FF0000]all your coins[/color][/b]."
                    this.feedback = createDialog(this, this.chestmessage, 'center', '24px')
                                        .setPosition(400, 180)
                                        .layout()
                                        .popUp(0)
                                        .setScrollFactor(0);
                    this.nCoins = 0;                    
                    let timer = this.time.addEvent({delay: outcomeDuration, 
                        callback: endChestEncounter,
                        args: [this, this.chestCount],
                        });
                    
                    this.chestCount++;
                }

                if (this.coin == -2){
                    this.losecoins = new LoseCoin(this, this.panelX, 250);
                    this.physics.add.collider(this.losecoins.sprite, this.platforms);
                    this.chestmessage = "[color=#FF0000][b]OH NO![/color][/b]\n"+
                                        "You have [color=#FF0000][b]lost a portion of your coins[/color][/b]!";

                    this.feedback = createDialog(this, this.chestmessage, 'center', '24px')
                                        .setPosition(400, 180)
                                        .layout()
                                        .popUp(0)
                                        .setScrollFactor(0); 
                    
                    setTimeout(() => {this.nextScene();}, 2000);
                }
          }, this);
        }
    }

};

var createDialog = function (scene, mainTxt, align, fontsize) {
    var textbox = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 600, 400, 0, '0x000000'),
  
    content: scene.rexUI.add.BBCodeText(0, 0, mainTxt, {
        fontFamily: 'Courier',
        fontSize: fontsize,
        align: align,
        color: '#FFFFFF',
    }),
              
    space: {
        content: 10,
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
    },
  
    expand: {
        content: true, 
    }
    })
    .layout();
    
    return textbox;
};





