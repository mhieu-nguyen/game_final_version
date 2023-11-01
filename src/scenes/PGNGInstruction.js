//scene to hold the task, in first context A. routes to 'next stage' scene 1

//import js game element modules (sprites, ui, outcome animations, etc.

import Robo1 from "../elements/robo1.js";
import Robo2 from "../elements/robo2.js";


var responseDuration = 1300;

//this function extends Phaser.Scene and includes the core logic for the game
export default class PGNG_Instruction extends Phaser.Scene {
    constructor() {
        super({
            key: 'PGNG_Instruction'
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
    

        this.load.spritesheet('robo1', './assets/spritesheets/robo1.png', { 
            frameWidth: 167.4, 
            frameHeight: 162 
        });

        this.load.spritesheet('robo2', './assets/spritesheets/robo2.png', { 
            frameWidth: 167.4, 
            frameHeight: 162  
        });

    }
    
    create() {
        this.cache.PGNGdata = {};
        this.cache.PGNGdata.robotOrder = [];
        this.cache.PGNGdata.trialType = [];
        this.cache.PGNGdata.optimalChoice = [];
        this.cache.PGNGdata.playerChoice = [];
        this.cache.PGNGdata.score = [];

        this.cache.PGNGdataKeys = ['Trial', 'robotOrder', 'trialType', 'optimalChoice', 'playerChoice', 'score'];

        this.cache.PGNGbatch = 0;
        this.robots = [];
        this.robotOn = [];        
        this.moving = [];

        this.robotCount = 0;
        this.roboFixed = [];
        this.gameStart = false;
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
        
        var robotEntryPoint = [];
        for (let i=0; i<2; i++){
            this.moving[i] = false;
            this.robotOn[i] = false;
            robotEntryPoint[i] = map.findObject("Object Layer 1", obj => obj.name === `robot_${i+1}`);
        };
            
           
        this.robots[0] = new Robo1(this, robotEntryPoint[0].x/this.sf, robotEntryPoint[0].y/this.sf);
        this.robots[1] = new Robo2(this, robotEntryPoint[1].x/this.sf, robotEntryPoint[1].y/this.sf);
        this.roboFixed[0] = false;    
        this.roboFixed[1] = false;
            

        this.physics.add.collider(this.robots[0].sprite, this.platforms);
        this.physics.add.collider(this.robots[0].sprite, this.roboTriggerPoint, robotFix, null, this); 
        this.physics.add.collider(this.robots[1].sprite, this.platforms);
        this.physics.add.collider(this.robots[1].sprite, this.roboTriggerPoint, robotFix, null, this); 
        
        
        // set the boundaries of the world
        this.physics.world.bounds.width = this.mapWidth/this.sf;
        this.physics.world.bounds.height = this.gameHeight;
        
        //////////////CONTROL CAMERA///////////////////////
        this.cameras.main.setBounds(0, 0, this.mapWidth/this.sf, this.gameHeight);
        
        

        ///////////FIXED INSTRUCTIONS TEXT/////////////////
        //add help text that has a "fixed" position on the screen
        
        this.instructionMessage = 'WELCOME!\n\n' +
        'In this game, you will be inspecting robots\n'+
        'as they move down the scanner. \n\n' +
        '[b]Sometimes[/b], a robot will [b][color=#0BDA51]need repair[/color][/b]. \n' +
        'How often a robot needs repair depends on its [b][color=#0BDA51]type[/color][/b].\n\n' +
        'There are [b][color=#0BDA51]12 different types[/color][/b] of robots identified by the [b][color=#0BDA51]COLORS[/color][/b]. \n' +
        'You must decide whether to [b][color=#0E86D4]REPAIR[/color][/b] or [b][color=#FF0000]IGNORE[/color][/b] the robot.\n\n' +
        'Press SPACE BAR to continue!';

        this.instruction = createDialog(this, this.instructionMessage)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
        
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space.once('down', function(){
            
            let timer = this.time.addEvent({delay: 1000, 
                                            callback: instruction_2,
                                            args: [this],
                                            loop: false});
        }, this);
        
    }
    
    update(time, delta) {
        ///////SPRITES THAT REQUIRE TIME-STEP UPDATING FOR ANIMATION////////
        // allow the player and predator to respond to key presses and move around
        this.robots[0].update(this.robotOn[0], this.moving[0]);  
        this.robots[1].update(this.robotOn[1], this.moving[1]);  
    }
    
    nextScene() {
        this.scene.start('Factory_v2');
       // this.scene.start('Factory1_set1');
    }
}
var instruction_2 = function(scene){
    scene.instruction.scaleDownDestroy(0);
    scene.instruction.destroy();
    scene.instructionMessage = 
        'You will earn the most points by [b][color=#0BDA51]fixing[/color][/b] robots that [b][color=#0BDA51]need repair[/color][/b] \n' +
        'and [b][color=#0BDA51]ignoring[/color][/b] robots that [b][color=#0BDA51]do not[/color][/b]. \n\n' +
        'Additionally, robots are categorized into [b][color=#0E86D4]SAFE[/color][/b] and [b][color=#FF0000]DANGEROUS[/color][/b].\n' +
        'If the scanner is [b][color=#0E86D4]BLUE[/color][/b], the robot is [b][color=#0E86D4]SAFE[/color][/b].\n' +
        'The [b][color=#FF0000]RED[/color][/b] scanner indicates a [b][color=#FF0000]DANGEROUS[/color][/b] robot.\n\n' +
        'Press SPACE BAR to continue to the examples!';
    scene.instruction = createDialog(scene, scene.instructionMessage)
    .setPosition(400, 300)
    .layout()
    .popUp(0); 
    
    scene.space.once('down', function(){
        scene.instruction.scaleDownDestroy(0);
        scene.robotOn[scene.robotCount] = true;
        scene.moving[scene.robotCount] = true;
        }, scene);
        
}

///////////////DEFINE GAME SEQUENCE FUNCTIONS/////////////////////////////////////
//1. when player hits robo trigger point, enter robot
var robotFix = function () {
    if (!this.roboFixed[this.robotCount]) {
        this.robots[this.robotCount].sprite.body.moves = false;
        this.moving[this.robotCount] = false;
        this.roboFixed[this.robotCount] = true;
        
        if (this.robotCount == 0){
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

    scene.robotOn[robotCount] = false;
    scene.moving[robotCount] = true;
    scene.robots[robotCount].sprite.body.moves = true;

    scene.moving[robotCount+1] = true;
    scene.robotOn[robotCount+1] = true;

    if (robotCount==1){
        scene.instruction.destroy();
        scene.instructionMessage = '\nPress SPACE BAR to continue!\n';
        
        scene.instruction = createDialog(scene, scene.instructionMessage)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
        scene.gameStart = true;
        scene.space.once('down', function(){
            scene.instruction.scaleDownDestroy(0);
            let timer = scene.time.addEvent({delay: 0, 
                                            callback: instruction_3,
                                            args: [scene],
                                            loop: false});
            scene.robotOn[scene.robotCount] = true;
            scene.moving[scene.robotCount] = true;
            }, scene);
    };
};

var instruction_3 = function(scene){
    scene.instruction.destroy();
    scene.instructionMessage = 
                'You will have [b][color=#0BDA51]1.3s[/color][/b] to decide if you want to [b][color=#0E86D4]repair (press SPACE)[/color][/b] \n' +
                'or [b][color=#FF0000]ignore (DO NOTHING)[/color][/b] the robot in the scanner. \n\n' +
                'You will earn [b][color=#0E86D4]+10 POINTS[/color][/b] for [b][color=#0BDA51]CORRECTLY[/color][/b] repairing\n'+
                'or ignoring a [b][color=#0E86D4]SAFE[/color][/b] robot.\n' +
                'You will only earn [b][color=#0E86D4]+1 POINT[/color][/b] if you decide [b][color=#FF0000]INCORRECTLY[/color][/b].\n\n' + 
                'You will lose [b][color=#FF0000]1 POINT[/color][/b] for [b][color=#0BDA51]CORRECTLY[/color][/b] repairing\n'+
                'or ignoring a [b][color=#FF0000]DANGEROUS[/color][/b] robot.\n' +
                'However, you will lose [b][color=#FF0000]10 POINTS[/color][/b] otherwise.\n\n' +
                'Press SPACE BAR to start the game!';
    scene.instruction = createDialog(scene, scene.instructionMessage)
    .setPosition(400, 300)
    .layout()
    .popUp(0); 
    
    scene.space.once('down', function(){
        scene.instruction.scaleDownDestroy(500);
        let timer = scene.time.addEvent({delay: 500, 
                                        callback: scene.nextScene(),
                                        loop: false});
        }, scene);
      
}
var createDialog = function (scene, mainTxt) {
    var textbox = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 600, 400, 20, '0x000000'),
  
    content: scene.rexUI.add.BBCodeText(0, 0, mainTxt, {
        fontFamily: 'Courier',
        fontSize: '20px',
        align: 'center',
        color: '#FFFFFF',
    }),
              
    space: {
        content: 10,
        left: 50,
        right: 50,
        top: 20,
        bottom: 20,
    },
  
    expand: {
        content: true, 
    }
    })
    .layout();
    
    return textbox;
  };



