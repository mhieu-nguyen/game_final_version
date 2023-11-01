//scene to hold the task, in first context A. routes to 'next stage' scene 1

//import js game element modules (sprites, ui, outcome animations, etc.

import Robo0 from "../elements/robo0.js";
import Robo1 from "../elements/robo1.js";
import Robo2 from "../elements/robo2.js";
import Robo3 from "../elements/robo3.js";
import Robo4 from "../elements/robo4.js";
import Robo5 from "../elements/robo5.js";
import Robo6 from "../elements/robo6.js";
import Robo7 from "../elements/robo7.js";
import Robo8 from "../elements/robo8.js";
import Robo9 from "../elements/robo9.js";
import Robo10 from "../elements/robo10.js";
import Robo11 from "../elements/robo11.js";

var responseDuration = 1300;
var outcomeDuration = 1200;

//this function extends Phaser.Scene and includes the core logic for the game
export default class Factory_v2 extends Phaser.Scene {
    constructor(key) {
        super({
            key: key
        });        
    }

    preload() {
        ////////////////////PRELOAD GAME ASSETS///////////////////////////////////
        // load tilemap and tileset created using Tiled 
        
        this.load.tilemapTiledJSON('factory', './assets/tilemaps/Robot_factory.json'); 
        this.load.image('factoryTile', './assets/tilesets/robot_factory.png');
        this.load.image("spotlight1", "./assets/tilesets/spotlight1.png");
        this.load.image("spotlight2", "./assets/tilesets/spotlight2.png");
        this.load.json("PGNG_trial_info", "./PGNG_trial_info.json")

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

        this.load.spritesheet('robo4', './assets/spritesheets/robo4.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo5', './assets/spritesheets/robo5.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo6', './assets/spritesheets/robo6.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo7', './assets/spritesheets/robo7.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo8', './assets/spritesheets/robo8.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo9', './assets/spritesheets/robo9.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo10', './assets/spritesheets/robo10.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

        this.load.spritesheet('robo11', './assets/spritesheets/robo11.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });
    }
    
    create() {
        this.result = 0;
        this.robots = [];
        this.robotOn = [];        
        this.moving = [];
        this.responseSpace = [10,-10,1,-1];
        this.responseIgnore = [1,-1,10,-10];
        this.optimalChoice = ['GO','NO-GO','NO-GO','GO'];
        this.trialType = ['GW','GAL','NGW','NGAL'];
        this.robotCount = 0;
        this.roboFixed = false;
        this.space = false;
        this.enterTime = this.time.now;

        let data = this.cache.json.get("PGNG_trial_info");
        this.cache.PGNG_trial_info = data;
        ////////////////////////CREATE WORLD//////////////////////////////////////
        //game world created in Tiled (https://www.mapeditor.org/) using pixel art sourced from from Open Game Art (https://opengameart.org/)
        // create tilemap
        var map = this.make.tilemap({ key: "factory" });
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
        this.response = [];

        for (let i=0; i<30; i++){
            this.robotOrder = this.robotOrder.concat(this.cache.PGNG_trial_info.robots[i]);
            this.response = this.response.concat(this.cache.PGNG_trial_info.responses[i]);
        }
        
        var robotEntryPoint = [];
        for (let i=0; i<120; i++){
            robotEntryPoint[i] = map.findObject("Object Layer 1", obj => obj.name === `robot_${i+1}`);
            var robo = Math.floor(i/4)+1;
            if (this.robotOrder[i]==0){
                this.robots[i] = new Robo0(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==1){
                this.robots[i] = new Robo1(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            } 
            else if (this.robotOrder[i]==2) {
                this.robots[i] = new Robo2(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
            }
            else if (this.robotOrder[i]==3) {
                this.robots[i] = new Robo3(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==4) {
                this.robots[i] = new Robo4(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==5) {
                this.robots[i] = new Robo5(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==6) {
                this.robots[i] = new Robo6(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==7) {
                this.robots[i] = new Robo7(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==8) {
                this.robots[i] = new Robo8(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==9) {
                this.robots[i] = new Robo9(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else if (this.robotOrder[i]==10) {
                this.robots[i] = new Robo10(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
                
            }
            else {
                this.robots[i] = new Robo11(this, robotEntryPoint[i].x/this.sf, robotEntryPoint[i].y/this.sf);
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
        this.instruction = 'To [b][color=#0E86D4]FIX[/color][/b]: press [b][color=#0E86D4]SPACE BAR[/color][/b].\n'+
                           'To [b][color=#FF0000]IGNORE[/color][/b]: [b][color=#FF0000]DO NOTHING[/color][/b].';

        createDialog(this, this.instruction, 'left', '18px')
        .setPosition(155, 565)
        .layout()
        .popUp(0)
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

        for (let i=0; i<120; i++){
            this.robots[i].update(this.robotOn[i], this.moving[i]);  
        }
    }
    
    nextScene() {
        this.cache.PGNGdata.robotOrder = this.cache.PGNGdata.robotOrder.concat(this.robotOrder);
        this.scene.start('PGNGQuestion');
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
        if (this.response[this.robotCount]%2 ==0){
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
    scene.cache.PGNGdata.trialType.push(scene.trialType[scene.response[robotCount]]);
    const sham = Math.random();
    if (scene.response[robotCount]%2 ==0){
        var color = '#0000FF';
        var response = '+';
        if (sham<0.8){
            scene.cache.PGNGdata.optimalChoice.push(scene.optimalChoice[scene.response[robotCount]]);
        }
        else {
            scene.cache.PGNGdata.optimalChoice.push(scene.optimalChoice[(scene.response[robotCount]+2)%4]);
        }
    }
    else{
        var color = '#FF0000';
        var response = '';
        if (sham<0.8){
            scene.cache.PGNGdata.optimalChoice.push(scene.optimalChoice[scene.response[robotCount]]);
        }
        else {
            scene.cache.PGNGdata.optimalChoice.push(scene.optimalChoice[(scene.response[robotCount]+2)%4]);
        }
    }

    if (scene.space){
        if (sham<0.8){
            this.result = scene.responseSpace[scene.response[robotCount]];
        }
        else{
            this.result = scene.responseIgnore[scene.response[robotCount]];
        }
        scene.cache.PGNGdata.score.push(this.result);
        scene.feedback = scene.add.text(370, 150, 
            `${response+this.result}`, 
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
        if (sham<0.8){
            this.result = scene.responseIgnore[scene.response[robotCount]];
        }
        else{
            this.result = scene.responseSpace[scene.response[robotCount]];
        }
        scene.cache.PGNGdata.score.push(this.result);
        scene.feedback = scene.add.text(370, 150, 
            `${response+this.result}`, 
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

    if (robotCount==119){
        scene.nextScene();
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



