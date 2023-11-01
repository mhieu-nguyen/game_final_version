export default class PGNGEndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PGNGEndScene'
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

        

        var csv = "";
        var header = this.cache.PGNGdataKeys;
        var subID = this.cache.subID;
        
        for (var h = 0; h < header.length; h++) {
            if (h > 0)
                csv = csv + ', ';
            csv = csv + header[h];
        }
        
        const data_length = this.cache.PGNGdata.robotOrder.length;
        csv = csv + '\n';
        for (var r = 0; r < data_length; r++) {
            csv = csv + r;
            for (var h = 1; h < header.length; h++) {
                csv = csv + ', ';
                csv = csv + this.cache.PGNGdata[header[h]][r];
            }
            csv = csv + '\n';
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
        var filepath = `data/subject_${this.cache.subID}/${this.cache.subID}_${date.getDate()}_${month}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_robotGNG.csv`;
        upload(csv, filepath);

        this.text = this.add.text();
        this.text.x = 400;
        this.text.y = 150;
        this.text.originX = 0.5;
        this.text.originY = 0.5;


        this.text.setText(
            'Thank you for completing this task!\n\n' +
            'Press SPACE BAR to start the final task!\n');
        this.text.setAlign('center');

    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)){
            this.scene.start('GameStart');
        }
    }
}




