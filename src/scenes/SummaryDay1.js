var totalCoins; var lossRate; var chestsOpen; 
export default class SummaryPanel extends Phaser.Scene {
    constructor() {
        super({
            key: 'SummaryDay1',
            autoStart: true
        });
        
        
    }

    preload(){
        this.load.image('background','./assets/imgs/treasure_theme.jpg')
    }

    create(){
        var bg = this.add.sprite(0, 0 ,'background').setOrigin(0,0);
        totalCoins = this.registry.get('coinsTotal');
        chestsOpen = this.cache.task1_data.Chest_Open[(this.cache.trial_no-1)*4];
        lossRate = 0.15;
        if (chestsOpen<25) {
            totalCoins = (1-lossRate)*totalCoins;
        }

        this.registry.set('coinsTotal', totalCoins);
        var message;

        if (chestsOpen == 25){
            message = "You have finished exploring the forest!\n" +
                      `You have collected [b][color=#FFFF00]${Number(totalCoins).toFixed(2)} coins[/color][/b] in total.\n` +
                      "You can now move on to the next environment. \n\n";
        }
        else{
            message = "You have decided to stop exploring the forest.\n" +
                      `This incurred a [b][color=#FF0000]${lossRate*100}% loss[/color][/b] of the total coins you have collected.\n` +
                      `You have [b][color=#FFFF00]${Number(totalCoins).toFixed(2)} coins[/color][/b] remaining.\n` +
                      "you have [b]3 more chances.[/b] to collect the required amount.\n\n";
        }

        this.summary = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x2F4F4F),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
                text: this.add.text(0, 0, `After envrionment 1`, {fontSize: '24px'}),
                align: 'center',
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            content: this.rexUI.add.BBCodeText(0, 0, 
                                               message,
                                               {fontSize: "20px",
                                                align: 'center',
                                                underline: {color: '#000',
                                                            offset: 6,
                                                            thickness: 3}}),

            actions: [createLabel(this, 'Press RIGHT ARROW to continue')],
            space: {
                    title: 25,
                    content: 10,
                    action: 10,
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    },
            align: {actions: 'center'},
            expand: {content: false}
        })

        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        
        this.summary.setPosition(gameWidth/2, gameHeight/2).layout().popUp(500);
        
        var right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        right.once('down', function(){
            this.nextScene();
        }, this);
    }
    
    update(time, delta) {}
    
    nextScene() {
        let timer = this.time.addEvent({delay: 2000, 
            callback: transition,
            args: [this],
            loop: false});
    } 
}
var transition = function(scene){
    scene.summary.scaleDownDestroy(0);
    scene.scene.start('Question_env1');
}
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