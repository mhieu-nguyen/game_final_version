export default class GameStart extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameStart',
            autoStart: true
        });
    }

    preload(){
        this.load.json('trial_info','./trial_info.json');
        
    }
    create() {
        let data = this.cache.json.get("trial_info");
        this.cache.trial_info = data;
        this.cache.trial = 0;
        this.cache.player_trial = 0;
         
        this.cache.data = {};
        this.cache.n_trials = 0;

        this.cache.dataKeys = ['health', 'hole1_y', 'hole2_y', 'player_y', 'score', 'trial', 'trial_type'];

        this.cache.dataKeys.forEach(k => {      
            this.cache.data[k] = [];
        });
        this.cache.n_trials = this.cache.trial_info.positions_A.length;
    
        this.instructionMessage = 'WELCOME!\n\n' +
        'Your task is to pilot a spaceship and [b][color=#0BDA51]avoid asteroids[/color][/b].\n\n' +
        'The better you are at avoiding the asteroids,\nthe higher your score will be!\n\n' +
        'There are [b][color=#0BDA51]GAPS[/color][/b] in the asteroid belt that appear \neither near the [b][color=#0BDA51]TOP or BOTTOM[/color][/b] of the screen, \n' +
        'try to aim for these to make it through without getting hit\n\n' +
        'You can move the ship using the [b][color=#0BDA51]UP and DOWN[/color][/b] arrow keys\n\n'+
        'Press SPACE BAR to continue';

        this.instruction = createDialog(this, this.instructionMessage)
                           .setPosition(400, 300)
                           .layout()
                           .popUp(0); 
    }

    update() {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.space.isDown) {
            cursors.space.isDown = false;
            this.scene.start('GameScene', {score: this.scoreVal});
        }
    }


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