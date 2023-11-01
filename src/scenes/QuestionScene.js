const COLOR_PRIMARY = 0x006400;
const COLOR_LIGHT = 0x420D09;
const COLOR_DARK = 0x800000;
export default class QuestionScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'QuestionScene',
            autoStart: true
        });
    }

    preload(){
        //this.load.image('background', './assets/imgs/treasure_theme.jpg')
    }

    create(){
        this.cache.answers = [];
        this.text = this.add.text();
        this.text.x = 400;
        this.text.y = 250;
        this.text.originX = 0.5;
        this.text.originY = 0.5;


        this.text.setText('\nQuestion 1\n\n On a scale of 0 to 10,\n'+'how much did you want to avoid the asteroids?\n');
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

            input: 'click'

        }).layout();
        this.slider.on('valuechange', function(slider){
            score = this.slider.value;
            print1.text = Math.round(10*this.slider.value);
        },this)
        

        var right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        right.once('down', function(){
            if (score!=-1){
                this.cache.answers.push(Math.round(10*this.slider.value));  
                let timer = this.time.addEvent({delay: 500, 
                                            callback: question_2,
                                            args: [this,print1],
                                            loop: false});
            }
            else{
                this.scene.start('QuestionScene');
            }
        }, this);
    }
    
    update(time, delta) {
      } 
    nextScene() {
    } 
}
var question_2 = function(scene, text){
    text.destroy();
    scene.text.setText('\nQuestion 2\n\nOn a scale of 0 to 10,\n'+'how anxious did the game make you feel?\n');
    scene.slider.destroy();
    
    var score = -1;
    var print2 = scene.add.text(400, 350, '');
    print2.setStyle({fontSize: '32px', color: '#0BDA51', strokeThickness: 0.8}); 
    scene.slider = scene.rexUI.add.slider({
        x: 400,
        y: 320,
        width: 400,
        height: 20,
        orientation: 'x',

        track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
        indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
        thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),

        input: 'click', // 'drag'|'click'
         
        
    }).layout();
    scene.slider.on('valuechange', function(slider){
        score = scene.slider.value;
        print2.text = Math.round(10*scene.slider.value);
    },scene)
    
        var right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        right.once('down', function(){
            if (score!=-1){
                scene.cache.answers.push(Math.round(10*scene.slider.value));  
                let timer = scene.time.addEvent({delay: 500, 
                                        callback: Ending,
                                        args: [scene,print2],
                                        loop: false});}
            else{
                question_2(scene,print2)
            }
        }, scene);
}

var Ending = function(scene,text){
    scene.text2.destroy();
    scene.slider.destroy();
    text.destroy();
    let csv = '';
        for (let i = 0; i<scene.cache.answers.length;i++){
            csv += scene.cache.answers[i];
            if (i< scene.cache.answers.length-1) {
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
        var filepath = `data/subject_${scene.cache.subID}/${scene.cache.subID}_${date.getDate()}_${month}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_Questions_AversiveLearning.csv`;
        upload(csv, filepath);
    scene.text.setText('THANK YOU SO MUCH FOR YOUR TIME!');
    scene.text.y = 300;
}

