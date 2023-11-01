const COLOR_PRIMARY = 0x006400;
const COLOR_LIGHT = 0x420D09;
const COLOR_DARK = 0x800000;
export default class PGNGQuestion extends Phaser.Scene {
    constructor() {
        super({
            key: 'PGNGQuestion',
            autoStart: true
        });
    }

    preload(){
        //this.load.image('background', './assets/imgs/treasure_theme.jpg')
    }

    create(){
        this.answer = 0;
        this.cache.answers = [];
    
        this.text = this.add.text();
        this.text.x = 400;
        this.text.y = 250;
        this.text.originX = 0.5;
        this.text.originY = 0.5;


        this.text.setText('\nOn a scale of 0 to 10,\n'+'how anxious are you when the DANGEROUS robot appear?\n');
        this.text.setAlign('center');
        this.text.setStyle({backgroundColor: '#000000', fontSize: '24px'});

        this.text2 = this.add.text();
        this.text2.x = 400;
        this.text2.y = 550;
        this.text2.originX = 0.5;
        this.text2.originY = 0.5;


        this.text2.setText('Use mouse/trackpad to change the slider value\n\n\nPress RIGHT ARROW KEY to continue\n');
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

            input: 'click' // 'drag'|'click'

        }).layout();
        this.slider.on('valuechange', function(slider){
            score = this.slider.value;
            print1.text = Math.round(10*this.slider.value);
        },this)
        var right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        right.once('down', function(){
            if (score!=-1){
            this.cache.answers.push(Math.round(10*this.slider.value));
            let timer = this.time.addEvent({delay: 1000, 
                                            callback: this.nextScene,
                                            callbackScope: this,
                                            loop: false});
            }
            else{
                this.scene.start('PGNGQuestion');
            }
        }, this);
    }
    
    update(time, delta) {
        
      } 
    
        
    
    
    nextScene() {
        let csv = '';
        for (let i = 0; i<this.cache.answers.length;i++){
            csv += this.cache.answers[i];
            if (i< this.cache.answers.length-1) {
                csv +=',';}
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
        var filepath = `data/subject_${this.cache.subID}/${this.cache.subID}_${date.getDate()}_${month}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_Questions_robotGNG.csv`;
        upload(csv, filepath);
        this.scene.start('PGNGEndScene');
    } 
}

