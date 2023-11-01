export default class QuestionPanel extends Phaser.Scene {
    constructor() {
        super({
            key: 'QuestionPanel',
            autoStart: true
        });
    }

    preload(){
        //this.load.image('background', './assets/imgs/treasure_theme.jpg')
    }

    create(){
        this.answers = 0;
        this.ending = false;
        this.text = this.add.text();
        this.text.x = 400;
        this.text.y = 280;
        this.text.originX = 0.5;
        this.text.originY = 0.5;


        this.text.setText('\nQuestion 1\n\n' +
            'Did the ogre chasing after you make you anxious?\n');
        this.text.setAlign('center');
        this.text.setStyle({backgroundColor: '#000000', fontSize: '24px'});


        this.text2 = this.add.text();
        this.text2.x = 400;
        this.text2.y = 550;
        this.text2.originX = 0.5;
        this.text2.originY = 0.5;


        this.text2.setText('Use mouse/trackpad to select your answer.');
        this.text2.setAlign('center');
        this.text2.setStyle({backgroundColor: '#000000', fontSize: '24px'});


        this.yes = this.add.text();
        this.yes.x = 350;
        this.yes.y = 390;
        this.yes.originX = 0.5;
        this.yes.originY = 0.5;
        this.yes.setText('YES'); 
        this.yes.setAlign('center');
        this.yes.setStyle({backgroundColor: '#008000', fontSize: '30px', fixedWidth:70});
        this.yes.setInteractive();
        this.yes.on('pointerdown', () => {this.cache.answers.push('YES');
                                          this.answers++;
                                          if (this.answers==1) this.text.setText('\nQuestion 2\n\n' +
                                            'Did you feel a sense of agency?\n');
                                          if (this.answers==2) this.text.setText('\nQuestion 3\n\n' +
                                            'Did you feel you had control over\n'+ 
                                            'whether the monster caught up or not?\n'); 
                                          if (this.answers==3) this.text.setText('\nQuestion 4\n\n' +
                                            'Did you press the arrow key more often\n' +
                                            'as the ogre got closer?\n');  
                                        });


        this.no = this.add.text();
        this.no.x = 450;
        this.no.y = 390;
        this.no.originX = 0.5;
        this.no.originY = 0.5;
        this.no.setText('NO'); 
        this.no.setAlign('center');
        this.no.setStyle({backgroundColor: '#FF0000', fontSize: '30px', fixedWidth:70});
        this.no.setInteractive();
        this.no.on('pointerdown', () => {this.cache.answers.push('NO');
                                          this.answers ++;
                                          if (this.answers==1) this.text.setText('\nQuestion 2\n\n' +
                                            'Did you feel a sense of agency?\n');
                                          if (this.answers==2) this.text.setText('\nQuestion 3\n\n' +
                                          'did you feel you had control over\n'+ 
                                          'whether the monster caught up or not?\n'); 
                                          if (this.answers==3) this.text.setText('\nQuestion 4\n\n' +
                                            'Did you press the arrow key more often\n' +
                                            'as the ogre got closer?\n');            
                                        });
         
    }
    
    update(time, delta) {
      if (this.answers>=4 && !this.ending){
        this.ending = true;
        ending(this);
      } 
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
      var filepath = `data/subject_${this.cache.subID}/${this.cache.subID}_${date.getDate()}_${month}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_Questions_AvoidanceLearning.csv`;
      upload(csv, filepath);
        this.scene.start('PGNG_Instruction');
    } 
}

var ending = function(scene){
  
  scene.yes.destroy();
  scene.no.destroy();
  scene.text.setText('\nAddtional comment/feedback?\n\n')
  scene.text.x = 400;
  scene.text.y = 200;

  scene.input.keyboard.clearCaptures();
  scene.txt = scene.add.text();
  scene.txt.x = 50;
  scene.txt.y = 230;
  scene.text.originX = 0.5;
  scene.text.originY = 0.5;  
  scene.txt.setText('[TYPE HERE]');
  scene.txt.setAlign('center');
  scene.txt.setStyle({backgroundColor: '#000000', fontSize: '20px', fixedWidth: 700, maxLines: 10, wordWrap: {width:600, useAdvancedWrap: false}});
  scene.txt.setInteractive();
  scene.txt.on('pointerdown', () => {scene.rexUI.edit(scene.txt)});
  
  scene.text2.setText('\nClick HERE to start next game.\n');
  scene.text2.setInteractive();
  scene.text2.on('pointerdown', () => {
    scene.cache.answers.push(scene.txt.text);
    scene.nextScene()});
  
}