//task end scene to inform participants they have finished the task, and route them to the post-task questions

//import some js from Pavlovia lib to enable data saving
//import * as data from "../../lib/data-2020.2.js";

//this function extends Phaser.Scene and includes the core logic for the scene
export default class Ending_Lose extends Phaser.Scene {
    constructor() {
        super({
            key: 'Ending_Lose',
            autoStart: true
        });
    }

    preload() {
        this.load.image('background','./assets/imgs/treasure_theme.jpg')
    }
    
    create() {
        this.message = "Unfortunately, you did not collect sufficient coins!\n\n" +

                      "Please [b][color=#0BDA51]TRY AGAIN[/color][/b] to collect [b][color=#FFFF00]1000 coins[/color][/b]!\n\n"
        //load space pic as background
        var bg = this.add.sprite(0, 0, 'background')
                          .setOrigin(0,0);
        
        //add popup dialogue box with instructions text
        this.instr = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x2F4F4F),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
                text: this.add.text(0, 0, 'OH NO!', {
                    fontSize: '24px'
                    }),
                align: 'center',
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            content: this.rexUI.add.BBCodeText(0, 0,  
                this.message,
                {fontSize: "20px",
                align: 'center',
                underline: {color: '#000',
                            offset: 6,
                            thickness: 3}}),
    
            actions: [
                createLabel(this, 'Press RIGHT ARROW to continue')
            ],
            space: {
                title: 25,
                content: 10,
                action: 10,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            align: {
                actions: 'center',
            },
            expand: {
                content: false, 
            }
            });
        
        //control panel position and layout
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        this.instr
        .setPosition(gameWidth/2, gameHeight/2)
        .layout()
        .popUp(500);
        
        //control action button functionality (click, hover)
        var right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        right.once('down', function(){
            this.nextScene();
        }, this);

        
    }
    
    update(time, delta) {
    }
    
    nextScene() {
        let timer = this.time.addEvent({delay: 2000, 
            callback: transition,
            args: [this],
            loop: false});
    } 
}

var transition = function(scene){
    scene.instr.scaleDownDestroy(0);
    scene.scene.start('Question_env4');
}

//generic function to create button labels
var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0x778899),
        text: scene.add.text(0, 0, text, {
            fontSize: '20px',
            fill: "#000000"
        }),
        align: 'center',
        width: 40,
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
};


