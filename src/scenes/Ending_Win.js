//task end scene to inform participants they have finished the task, and route them to the post-task questions

//import some js from Pavlovia lib to enable data saving
//import * as data from "../../lib/data-2020.2.js";

//this function extends Phaser.Scene and includes the core logic for the scene
export default class Ending_Win extends Phaser.Scene {
    constructor() {
        super({
            key: 'Ending_Win',
            autoStart: true
        });
    }

    preload() {
        this.load.image('background','./assets/imgs/treasure_theme.jpg')
    }
    
    create() {
        //load space pic as background
        var bg = this.add.sprite(0, 0, 'background')
                          .setOrigin(0,0);
        
        //add popup dialogue box with instructions text
        var instr = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x2F4F4F),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
                text: this.add.text(0, 0, 'Congratulations!', {
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
            content: this.add.text(0, 0, 
                      "You managed to collect sufficient coins!\n\n" +

                      "Thank you for completing this task.\n\n",
            

                    {fontSize: "22px",
                     align: 'center'}),
            actions: [
                createLabel(this, 'Pres SPACE BAR to continue.')
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
        instr
        .setPosition(gameWidth/2, gameHeight/2)
        .layout()
        .popUp(500);
        
        //control action button functionality (click, hover)
        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.once('down', function(){
            instr.scaleDownDestroy(500);

            let timer = this.time.addEvent({delay: 1000, 
                                            callback: this.nextScene(),
                                            loop: false});
        }, this);

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
        var filepath = `data/subject_${this.cache.subID}/${this.cache.subID}_${date.getDate()}_${month}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_AvoidanceLearning.csv`;
        upload(csv, filepath);
    }
    
    update(time, delta) {
    }
    
    nextScene() {
        this.scene.start('PostTaskQuestion'); 
    } 
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


