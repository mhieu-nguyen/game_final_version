const COLOR_PRIMARY = 0x006400;
const COLOR_LIGHT = 0x420D09;
const COLOR_DARK = 0x800000;
export default class MidTaskQuestion extends Phaser.Scene {
    constructor(key) {
        super({
            key: key,
            autoStart: true,
        });
        this.key = key;
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


      this.text.setText('\nHow are you feeling at the moment?\n');
      this.text.setAlign('center');
      this.text.setStyle({backgroundColor: '#000000', fontSize: '24px'});

      this.text2 = this.add.text();
      this.text2.x = 400;
      this.text2.y = 550;
      this.text2.originX = 0.5;
      this.text2.originY = 0.5;


      this.text2.setText('Please use mouse/trackpad to change the slider value\n\n\nPress SPACE BAR to continue\n');
      this.text2.setAlign('center');
      this.text2.setStyle({backgroundColor: '#000000', fontSize: '24px'});

      this.left = this.add.text(150, 350, 'Hostile');
      this.left.setAlign('left');
      this.left.setStyle({backgroundColor: '#000000', fontSize: '24px'});

      this.middle = this.add.text(350, 350, 'Neutral');
      this.middle.setAlign('center');
      this.middle.setStyle({backgroundColor: '#000000', fontSize: '24px'});

      this.right = this.add.text(550, 350, 'Friendly');
      this.right.setAlign('right');
      this.right.setStyle({backgroundColor: '#000000', fontSize: '24px'});

      var score = -1;
    
      this.slider = this.rexUI.add.slider({
          x: 400,
          y: 320,
          width: 400,
          height: 20,
          orientation: 'x',
          value:0.5,

          track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
          indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
          thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),

          input: 'click', // 'drag'|'click'
          value: 0.5,

      })
          .layout();
      this.slider.on('valuechange', function(slider){
          score = this.slider.value;
      },this)
      
      var space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      space.once('down', function(){
          if (score!=-1){
          this.cache.answers.push(Math.round(100*this.slider.value));
          let timer = this.time.addEvent({delay: 500, 
                                          callback: question_2,
                                          args: [this],
                                          loop: false});}
          else{
              this.scene.start(this.key)
          }                      
      }, this);
  }
  
  update(time, delta) {
  } 
  
  nextScene() {
    if (this.key == 'Question_env1'){
        this.scene.start(`day2Scene_${this.cache.trial_no-1}`);
    }
    else if (this.key == 'Question_env2'){
        this.scene.start(`day3Scene_${this.cache.trial_no-1}`);
    }
    else {
        this.scene.start(`day4Scene_${this.cache.trial_no-1}`);
    }
    }
}
var question_2 = function(scene){
  scene.left.setText('Tensed');
  scene.right.setText('Relaxed');

  scene.slider.destroy();
  var score = -1;
 
   
  scene.slider = scene.rexUI.add.slider({
      x: 400,
      y: 320,
      width: 400,
      height: 20,
      orientation: 'x',
      value:0.5,

      track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
      indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
      thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),

      input: 'click', // 'drag'|'click'
         
        
  }).layout();
  scene.slider.on('valuechange', function(slider){
      score = scene.slider.value;

  },scene)
    
  var space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    space.once('down', function(){
        if (score!=-1){
            scene.cache.answers.push(Math.round(100*scene.slider.value));  
            let timer = scene.time.addEvent({delay: 500, 
                                    callback: question_3,
                                    args: [scene],
                                    loop: false});}
        else{
            question_2(scene)
            }
    }, scene);
}

var question_3 = function(scene){
  scene.left.destroy();
  scene.right.destroy();
  scene.text.setText('\nOn a scale of 0 to 10,\n'+'how anxious are you right now?\n');
  scene.slider.destroy();
  scene.middle.setText('');
  scene.middle.x = 400;
  var score = -1;
  scene.middle.setStyle({fontSize: '32px', color: '#0BDA51', strokeThickness: 0.8});
   
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
      scene.middle.text = Math.round(10*this.slider.value);
  },scene)
    
  var space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    space.once('down', function(){
        if (score!=-1){
            scene.cache.answers.push(Math.round(10*scene.slider.value));  
            let timer = scene.time.addEvent({delay: 500, 
                                    callback: scene.nextScene(),
                                    loop: false});}
        else{
            question_3(scene)
            }
    }, scene);
}
