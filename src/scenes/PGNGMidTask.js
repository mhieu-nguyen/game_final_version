//scene to hold the task, in first context A. routes to 'next stage' scene 1

//import js game element modules (sprites, ui, outcome animations, etc.



var responseDuration = 1500;

//this function extends Phaser.Scene and includes the core logic for the game
export default class PGNG_MidTask extends Phaser.Scene {
    constructor() {
        super({
            key: 'PGNG_MidTask'
        });        
        
    }

    preload() {
        ////////////////////PRELOAD GAME ASSETS///////////////////////////////////
        // load tilemap and tileset created using Tiled 
        this.load.tilemapTiledJSON('factory1', './assets/tilemaps/Robot_factory.json'); 
        this.load.image('factoryTile', './assets/tilesets/robot_factory.png');
        this.load.image("spotlight1", "./assets/tilesets/spotlight1.png");
        this.load.image("spotlight2", "./assets/tilesets/spotlight2.png");

    }
    
    create() {
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

        
        // set the boundaries of the world
        this.physics.world.bounds.width = this.mapWidth/this.sf;
        this.physics.world.bounds.height = this.gameHeight;
        
        //////////////CONTROL CAMERA///////////////////////
        this.cameras.main.setBounds(0, 0, this.mapWidth/this.sf, this.gameHeight);
        
        
        ///////////FIXED INSTRUCTIONS TEXT/////////////////
        //add help text that has a "fixed" position on the screen
        var { SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.input.keyboard.addKeys({space: SPACE});

        this.text = this.add.text();
        this.text.x = 400;
        this.text.y = 150;
        this.text.originX = 0.5;
        this.text.originY = 0.5;


        this.text.setText(
            'In the next part, you will perform the same task. \n' +
            'However, a different new set of robots are being inspected this time. \n\n' +
            'Press SPACE to continue when you are ready!');
        this.text.setAlign('center');
        
    }
    
    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)){
            this.scene.start('Factory2_set1');
        }
    }
}



