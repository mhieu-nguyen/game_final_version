const COLOR_PRIMARY = 0x006400;
const COLOR_LIGHT = 0x420D09;
const COLOR_DARK = 0x800000;
export default class Question_env4 extends Phaser.Scene {
    constructor() {
        super({
            key: 'Question_env4',
            autoStart: true
        });
    }

    preload(){
        //this.load.image('background', './assets/imgs/treasure_theme.jpg')
    }

    create(){
        this.answer = 0;
          
        this.text = this.add.text();
        this.text.x = 400;
        this.text.y = 250;
        this.text.originX = 0.5;
        this.text.originY = 0.5;


        this.text.setText('\nOn a scale of 0 to 10,\n'+'how anxious are you right now?\n');
        this.text.setAlign('center');
        this.text.setStyle({backgroundColor: '#000000', fontSize: '24px'});

        this.text2 = this.add.text();
        this.text2.x = 400;
        this.text2.y = 550;
        this.text2.originX = 0.5;
        this.text2.originY = 0.5;


        this.text2.setText('Use mouse/trackpad to change the slider value\n\n\nPress SPACE BAR to continue\n');
        this.text2.setAlign('center');
        this.text2.setStyle({backgroundColor: '#000000', fontSize: '24px'});

        var score = -1;
        var print1 = this.add.text(400, 350, '');
        print1.setStyle({fontSize: '32px', color: '#0BDA51', strokeThickness: 0.8});
        this.slider = this.rexUI.add.slider({
            x: 400,
            y: 320,
            width: 400,
            height: 20,
            orientation: 'x',

            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
            indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),

            input: 'click'
        

        })
            .layout();
        this.slider.on('valuechange', function(slider){
            score = this.slider.value;
            print1.text = Math.round(10*this.slider.value);
        },this);
        
        var space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        space.once('down', function(){
            this.text.destroy();
            this.text2.destroy();
            if (score!=-1){
            this.cache.answers.push(Math.round(10*this.slider.value));
            let timer = this.time.addEvent({delay: 500, 
                                            callback: this.nextScene(),
                                            loop: false});
            }
            else{
               
                this.scene.start('Question_env4');
            }
        }, this);
    }
    
    update(time, delta) { } 
    
    nextScene() {
        if (this.cache.task1Completed){
            this.scene.start('QuestionPanel');
        }
        else{
            this.scene.start(`day1Scene_${this.cache.trial_no}`);
        }
    } 
}

