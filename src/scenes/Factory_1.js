//scene to hold the task, in first context A. routes to 'next stage' scene 1

//import js game element modules (sprites, ui, outcome animations, etc.

import Robo0 from "../elements/robo0.js";
import Robo1 from "../elements/robo1.js";
import Robo2 from "../elements/robo2.js";
import Robo3 from "../elements/robo3.js";

var responseDuration = 1500;
var outcomeDuration = 1000;

//this function extends Phaser.Scene and includes the core logic for the game
export default class Factory_1 extends Phaser.Scene {
    constructor(key) {
        super({
            key: key
        });        
    }

    preload() {
        ////////////////////PRELOAD GAME ASSETS///////////////////////////////////
        // load tilemap and tileset created using Tiled 
        
        this.load.tilemapTiledJSON('factory1', './assets/tilemaps/Robot_factory.json'); 
        this.load.image('factoryTile', './assets/tilesets/robot_factory.png');
        this.load.image("spotlight1", "./assets/tilesets/spotlight1.png");
        this.load.image("spotlight2", "./assets/tilesets/spotlight2.png");

        // load player sprite
        this.load.spritesheet('robo0', './assets/spritesheets/robo0.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo1', './assets/spritesheets/robo1.png', { 
            frameWidth: 167.4, 
            frameHeight: 162 
        });

        this.load.spritesheet('robo2', './assets/spritesheets/robo2.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo3', './assets/spritesheets/robo3.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });
    }
    
    create() {
        this.robots = [];
        this.robotOn = [];        
        this.moving = [];
        this.responseSpace = [];
        this.responseIgnore = [];
        this.robotCount = 0;
        this.roboFixed = false;
        this.space = false;
        this.enterTime = this.time.now;
        ////////////////////////CREATE WORLD//////////////////////////////////////
        //game world created in Tiled (https://www.mapeditor.org/) using pixel art sourced from from Open Game Art (https://opengameart.org/)
        // create tilemap
        var map = this.make.tilemap({ key: "factory1" });
        var tileset = map.addTilesetImage("robot_factory", "factoryTile"); //first arg is name you gave the tileset in Tiled
        this.spotlight1 = this.add.sprite(0,0,'spotlight1').setOrigin(0,0).setScrollFactor(0);
        this.spotlight1.visible = false;
        this.spotlight2 = this.add.sprite(0,0,'spotlight2').setOrigin(0,0).setScrollFactor(0);
        this.spotlight2.visible = false;
        
        // set some size scaling variables as our tilemap is big!
        this.gameHeight = this.sys.game.config.height;
        this.gameWidth = this.sys.game.config.width;
        this.mapHeight = map.heightInPixels;
        this.mapWidth = map.widthInPixels;
        this.sf = this.mapHeight/this.gameHeight;
        const displayWidth = this.mapWidth/this.sf;
        
        // set up scene layers using names set up in Tiled      

        this.platforms = map.createDynamicLayer("platforms", tileset, 0, 0)
        this.platforms.displayHeight = this.gameHeight;
        this.platforms.displayWidth = displayWidth;

        // set up 'collides' property for platform tiles (set in Tiled)
        this.platforms.setCollisionByProperty({ collides: true });


        
        const chamber = map.findObject("Object Layer 1", obj => obj.name === 'chamber');

        this.roboTriggerPoint = this.physics.add.sprite(chamber.x/this.sf, chamber.y/this.sf);
        this.roboTriggerPoint.displayHeight = this.gameHeight*2; 
        this.roboTriggerPoint.immovable = true;
        this.roboTriggerPoint.body.moves = false;
        this.roboTriggerPoint.allowGravity = false; 

        this.robotOrder = [];
        var order = [0,1,2,3];
        this.sham = [[],[],[],[]];

        for (let i=0; i<15; i++){
            this.robotOrder = this.robotOrder.concat(Phaser.Utils.Array.Shuffle(order));
        }
        
        for (let i=0; i<4; i++){
            for (let j=0; j<3; j++){
                this.sham[i] = this.sham[i].concat(Phaser.Utils.Array.Shuffle([0,0,0,0,1]));
            }
        }

        
        var robotEntryPoint = [];
        for (let i=0; i<60; i++){
            robotEntryPoint[i] = map.findObject("Object Layer 1", obj => obj.name === `robot_${i+1}`);
            var robo = Math.floor(i/4)+1;
            if (this.robotOrder[i]==0){
                this.robots[i] = new Robo0(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                this.cache.PGNGdata.trialType.push('GW');
                if (this.sham[0][robo] == 0){
                    this.cache.PGNGdata.optimalChoice.push('G');
                    this.responseSpace[i] = 10;
                    this.responseIgnore[i] = 1;
                }
                else{
                    this.cache.PGNGdata.optimalChoice.push('NG');
                    this.responseSpace[i] = 1;
                    this.responseIgnore[i] = 10;
                }
            }
            else if (this.robotOrder[i]==1){
                this.robots[i] = new Robo1(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                this.cache.PGNGdata.trialType.push('GAL');
                if (this.sham[1][robo] == 0){
                    this.cache.PGNGdata.optimalChoice.push('G');
                    this.responseSpace[i] = -1;
                    this.responseIgnore[i] = -10;
                }
                else{
                    this.cache.PGNGdata.optimalChoice.push('NG');
                    this.responseSpace[i] = -10;
                    this.responseIgnore[i] = -1;
                }
            } 
            else if (this.robotOrder[i]==2) {
                this.robots[i] = new Robo2(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                this.cache.PGNGdata.trialType.push('NGW');
                if (this.sham[2][robo] == 0){
                    this.cache.PGNGdata.optimalChoice.push('NG');
                    this.responseSpace[i] = 1;
                    this.responseIgnore[i] = 10;
                }
                else{
                    this.cache.PGNGdata.optimalChoice.push('G');
                    this.responseSpace[i] = 10;
                    this.responseIgnore[i] = 1;
                }
            }
            else {
                this.robots[i] = new Robo3(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                this.cache.PGNGdata.trialType.push('NGAL');
                if (this.sham[3][robo] == 0){
                    this.cache.PGNGdata.optimalChoice.push('NG');
                    this.responseSpace[i] = -10;
                    this.responseIgnore[i] = -1;
                }
                else{
                    this.cache.PGNGdata.optimalChoice.push('G');
                    this.responseSpace[i] = -1;
                    this.responseIgnore[i] = -10;
                }
            };

            this.moving[i] = false;
            this.robotOn[i] = false;

            this.physics.add.collider(this.robots[i].sprite, this.platforms);
            this.physics.add.collider(this.robots[i].sprite, this.roboTriggerPoint, robotFix, null, this); 
        };
        
        // set the boundaries of the world
        this.physics.world.bounds.width = this.mapWidth/this.sf;
        this.physics.world.bounds.height = this.gameHeight;
        
        //////////////CONTROL CAMERA///////////////////////
        this.cameras.main.setBounds(0, 0, this.mapWidth/this.sf, this.gameHeight);
        
        

        ///////////FIXED INSTRUCTIONS TEXT/////////////////
        //add help text that has a "fixed" position on the screen
        this.add
            .text(5, 16, "press SPACE to fix the robot!\n"+
                          "do nothing to ignore the robot!", {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 }
            })
            .setScrollFactor(0);     
        //this.physics.add.collider(this.player.sprite,this.predator.sprite);
        //2. check for overlap between player and chests:

        var { SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.input.keyboard.addKeys({
        space: SPACE,
        });

        this.trialStartTime = this.time.now;
        this.lastChestTime = this.time.now;
        this.robotOn[0] = true;
        this.moving[0] = true;
        
    }
    
    update(time, delta) {
        ///////SPRITES THAT REQUIRE TIME-STEP UPDATING FOR ANIMATION////////
        // allow the player and predator to respond to key presses and move around
        if (this.roboFixed && !this.space && Phaser.Input.Keyboard.JustDown(this.keys.space)){
            this.cache.PGNGdata.playerChoice.push(Math.round(this.keys.space.timeDown - this.enterTime));
            this.space = true;
            }

        for (let i=0; i<60; i++){
            this.robots[i].update(this.robotOn[i], this.moving[i]);  
        }
    }
    
    nextScene() {
        this.cache.PGNGbatch++;
        this.cache.PGNGdata.robotOrder = this.cache.PGNGdata.robotOrder.concat(this.robotOrder);
        if (this.cache.PGNGbatch==1){
            this.scene.start('Factory1_set2');
        }
        if (this.cache.PGNGbatch==2){
            this.scene.start('PGNG_MidTask');
        }
    }
}

///////////////DEFINE GAME SEQUENCE FUNCTIONS/////////////////////////////////////
//1. when player hits robo trigger point, enter robot
var robotFix = function () {
    this.robots[this.robotCount].sprite.body.moves = false;
    this.moving[this.robotCount] = false;
    if (!this.roboFixed) {
        this.enterTime = this.time.now;

        this.roboFixed = true;
        if (this.robotOrder[this.robotCount]%2 ==0){
            this.spotlight1.visible = true;
        }
        else{
            this.spotlight2.visible = true;
        }

        this.time.addEvent({delay: responseDuration, 
            callback: robotOutcome,
            args: [this, this.robotCount],
            });

        this.robotCount++;
    }   
};

var robotOutcome = function(scene, robotCount){
    scene.spotlight1.visible = false;       
    scene.spotlight2.visible = false; 
    if (scene.robotOrder[robotCount]%2 ==0){
        var color = '#0000FF';
        var response = '+';
    }
    else{
        var color = '#FF0000';
        var response = '';
    }
    if (scene.space){
        scene.cache.PGNGdata.score.push(scene.responseSpace[robotCount]);
        scene.feedback = scene.add.text(370, 150, 
            `${response+scene.responseSpace[robotCount]}`, 
            {
            font: "28px monospace",
            fontStyle: "strong",
            fill: color,
            align: 'center',
            padding: { x: 0, y: 10 },
            backgroundColor: "#FFFFFF",
            fixedWidth: 70,
            });
    }
    else{
        scene.cache.PGNGdata.playerChoice.push(-1);
        scene.cache.PGNGdata.score.push(scene.responseIgnore[robotCount]);
        scene.feedback = scene.add.text(370, 150, 
            `${response+scene.responseIgnore[robotCount]}`, 
            {
            font: "28px monospace",
            fontStyle: "strong",
            fill: color,
            align: 'center',
            padding: { x: 0, y: 10 },
            backgroundColor: "#FFFFFF",
            fixedWidth: 70,
           
            });
    }
    scene.time.addEvent({delay: outcomeDuration, 
            callback: endRobotFix,
            args: [scene, robotCount, scene.feedback],
            });
}

var endRobotFix = function(scene, robotCount, feedback) {
    feedback.destroy();
    scene.moving[robotCount] = true;
    scene.robotOn[robotCount] = false;
    scene.robots[robotCount].sprite.body.moves = true;

    scene.moving[robotCount+1] = true;
    scene.robotOn[robotCount+1] = true;
    scene.roboFixed = false;
    scene.space = false;

    if (robotCount==19){
        scene.nextScene();
    }
};





