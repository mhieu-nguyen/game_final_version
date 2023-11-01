
export default class InstructionPanel extends Phaser.Scene {
    constructor() {
        super({
            key: 'InstructionPanel',
            autoStart: true
        });
    }

    preload(){
        this.load.image('background', './assets/imgs/treasure_theme.jpg')
    }

    create(){
        document.addEventListener("DOMContentLoaded", function () {
        if (document.referrer !== "") {const sampleID = parseIdfromReferrer(document.referrer);}
        });
        const sampleID = parseIdfromReferrer(document.referrer);
       
        this.cache.subID = sampleID;
        this.registry.set('subID', this.cache.subID);

        this.cache.task1_data = {}
        this.cache.trial_no = 0;
        this.cache.answers = [];
        this.cache.task1Completed = false;

        this.cache.task1_data.trial_no = [];
        this.cache.task1_data.environment = [];
        this.cache.task1_data.Chest_Open = [];
        this.cache.task1_data.Time_Between_Chests = [];
        this.cache.task1_data.Decision_Times = [];
        this.cache.task1_data.Key_Presses = [];
        this.cache.task1_data.Key_Times = [];
        this.cache.task1_data.Distance = [];
        this.cache.task1_data.Speed = [];
        this.cache.task1_data.Total_Time = [];
        this.cache.task1_data.Total_coins = [];
        
        this.arrow_count = 0;
        var { RIGHT } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.input.keyboard.addKeys({right: RIGHT});

        this.instruction_1 = 'WELCOME!!\n\n' +
        'You are tasked to collect [b][color=#FFFF00] 1000 coins [/color][/b] from treasure chests\n' +
        'scattered in [b] 4 different environments[/b]. \n' +
        'Each environment has [b]25 chests[/b].\n' +
        'Meanwhile, you are chased after by a menacing ogre.\n\n'+
        'Press [b]RIGHT ARROW KEY[/b] to continue!\n';

        this.instruction_2 = 'At each chest, you must decide if you want to [b][color=#0E86D4]open[/color][/b] or [b][color=#FF0000]exit[/color][/b].\n' +
        'To [b][color=#0E86D4]open[/color][/b] the chest: press [b][color=#0E86D4] SPACE BAR [/color][/b].\n'+
        'To [b][color=#FF0000]exit[/color][/b]: press [b][color=#FF0000]X[/color][/b].\n\n'+
        'Press [b]RIGHT ARROW KEY[/b] to continue!\n';

        this.instruction_3 = 'Some chests are traps, and the ogre will catch you\n' +
        'if you [b][color=#0E86D4]open[/color][/b] them. You will then [b][color=#FF0000]lose all of your coins[/color][/b].\n\n' +
        '[b][color=#FF0000]Exit[/color][/b] will apply a [b][color=#FF0000]penalty to your current coins[/color][/b],\n' +
        'and immediately proceed you to the [b]next environment[/b].\n\n' +
        'Press [b]RIGHT ARROW KEY[/b] to continue!\n';

        this.instruction_4 = 'You can use the [b]RIGHT ARROW KEY[/b] to move about the environments.\n' +
        'Your current speed is displayed at the [b]top left screen[/b].\n ' +
        'Every time you press the RIGHT ARROW KEY,\n' +
        'your speed will [b][color=#0E86D4]increase[/color][/b].\n\n'+
        'Press [b]RIGHT ARROW KEY[/b] to continue!\n';

        this.instruction_5 = 'To run [b]faster[/b], press the arrow key [b]more frequently[b].\n' +
        '[b]Holding the arrow key down[/b] is counted as only [b]1 press[/b].\n' +
        'If you [b]do not[/b] press the key often enough,\n' +
        'your speed will [b][color=#FF0000]decrease[/color][/b].\n\n'+
        'Press [b]RIGHT ARROW KEY[/b] to continue!\n';

        this.instruction_6 = 'The ogre will catch up to you,\n' +
        'and you will start [b][color=#FF0000]losing coins[/color][/b] if the ogre is [b][color=#FF0000]too close[/color][/b].\n' +
        'Eventually, the ogre will catch you.\n' +       
        'If you get caught, he will [b][color=#FF0000]rob you of all your coins[/color][/b].\n\n' +
        'Press [b]RIGHT ARROW KEY[/b] to start [b]pre-task questions[/b]!\n'

        this.instruction = 'You will now complete few games.\n'+
        'Each one should take approximately 15 minutes\n\n'+
        'You can take a break between each game,\n'+
        'but try to complete them as closely as possible.\n\n'+
        'If there are any problems with the games,\n' +
        'please email us at pkumar@mclean.harvard.edu \n\n\n\n\n'+
        'Please press SPACE BAR to continue';
        this.dialog = createDialog(this, this.instruction)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
        
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.space.once('down', function(){
            let timer = this.time.addEvent({delay: 1000, 
                                            callback: instruction,
                                            args: [this],
                                            loop: false});
        }, this);

    }
    
    update(time, delta) {
        }
    
    nextScene() {
      this.scene.start('PreTaskQuestion');
    } 
}
var instruction = function(scene){
  scene.add.sprite(0, 0 ,'background').setOrigin(0,0);
  scene.dialog.scaleDownDestroy(0);
  scene.dialog = createDialog(scene, scene.instruction_1)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
      
  scene.right.once('down', function(){
    
    let timer = scene.time.addEvent({delay: 1000, 
                                    callback: instruction_2,
                                    args: [scene, scene.instruction_2],
                                    loop: false});
   }, scene);
}

var instruction_2 = function(scene){
  scene.dialog.scaleDownDestroy(0);
  scene.dialog = createDialog(scene, scene.instruction_2)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
      
  scene.right.once('down', function(){
    
    let timer = scene.time.addEvent({delay: 1000, 
                                    callback: instruction_3,
                                    args: [scene, scene.instruction_3],
                                    loop: false});
   }, scene);
}

var instruction_3 = function(scene){
  scene.dialog.scaleDownDestroy(0);
  scene.dialog = createDialog(scene, scene.instruction_3)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
      
  scene.right.once('down', function(){
    

    let timer = scene.time.addEvent({delay: 1000, 
                                    callback: instruction_4,
                                    args: [scene, scene.instruction_4],
                                    loop: false});
   }, scene);
}

var instruction_4 = function(scene){
  scene.dialog.scaleDownDestroy(0);
  scene.dialog = createDialog(scene, scene.instruction_4)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
      
  scene.right.once('down', function(){


    let timer = scene.time.addEvent({delay: 1000, 
                                    callback: instruction_5,
                                    args: [scene, scene.instruction_5],
                                    loop: false});
   }, scene);
}

var instruction_5 = function(scene){
  scene.dialog.scaleDownDestroy(0);
  scene.dialog = createDialog(scene, scene.instruction_5)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
      
  scene.right.once('down', function(){


    let timer = scene.time.addEvent({delay: 1000, 
                                    callback: instruction_6,
                                    args:[scene, scene.instruction_6],
                                    loop: false});
   }, scene);
}

var instruction_6 = function(scene){
  scene.dialog.scaleDownDestroy(0);
  scene.dialog = createDialog(scene, scene.instruction_6)
        .setPosition(400, 300)
        .layout()
        .popUp(0); 
      
  scene.right.once('down', function(){

    let timer = scene.time.addEvent({delay: 1000, 
                                    callback: scene.nextScene(),
                                    loop: false});
   }, scene);
}

var createDialog = function (scene, mainTxt) {
  var textbox = scene.rexUI.add.dialog({
  background: scene.rexUI.add.roundRectangle(0, 0, 600, 400, 20, '0x000000'),

  content: scene.rexUI.add.BBCodeText(0, 0, mainTxt, {
      fontFamily: 'Courier',
      fontSize: '20px',
      align: 'center',
      color: '#FFFFFF',
  }),
            
  space: {
      content: 10,
      left: 50,
      right: 50,
      top: 20,
      bottom: 20,
  },

  expand: {
      content: true, 
  }
  })
  .layout();
  
  return textbox;
};

function parseIdfromReferrer(url) {
    if (!url) return parseIdfromReferrer(window.location.href);
    var parsedUrl = new URL(url);
    let localId = localStorage.getItem("userId");
    let parsedId = parsedUrl.searchParams.get("id");
    var id = "";
    if (parsedId) id = parsedId;
    else if (localId) id = localId;
    if (id) {
      localStorage.setItem("userId", id);
      if (!parsedId) updateUrlWithCustomId(id);
      return id;
    }
    id = generateRandomString();
    localStorage.setItem("userId", id);
        (id); // Update URL with custom ID
    return id;
  }

function generateRandomString() {
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var uniqueChars = [];
    while (uniqueChars.length < 5) {
      var randomIndex = Math.floor(Math.random() * alphabet.length);
      var randomChar = alphabet[randomIndex];
      if (!uniqueChars.includes(randomChar)) {
        uniqueChars.push(randomChar);
      }
    }
    var randomString = uniqueChars.join("");
    return "RANDOM_" + randomString;
  }
  
function updateUrlWithCustomId(customId) {
    var baseUrl = window.location.origin + window.location.pathname;
    var updatedUrl;
    if (window.location.search.indexOf("id=") !== -1) {
      updatedUrl = window.location.href.replace(
        /([?&])id=([^&]*)/,
        "$1id=" + customId
      );
    } else {
      updatedUrl = baseUrl + "?id=" + customId;
    }
    window.location.href = updatedUrl;
}
