class AvoidanceStart extends Phaser.Scene {
    constructor() {
        super({
            key: 'AvoidanceStart',
        });
    }

    create() {

        this.instructionMessage = 'This next part is a little different to the previous one.\n\n' +
        'This time, you will be faced with a group of \n'+
        '[b][color=#0BDA51]asteroids flying towards you[/color][/b],\n' +
        'and you will need to [b][color=#0BDA51]avoid[/color][/b] these\n\n' +
        'The asteroids will always appear directly \n'+
        '[b][color=#0BDA51]in front[/color][/b] of your spaceship\n\n' +
        'Press SPACE BAR to begin!';
        
        this.instruction = createDialog(this, this.instructionMessage)
                           .setPosition(400, 300)
                           .layout()
                           .popUp(0); 

        this.cache.n_trials = 30;
        this.cache.player_trial = 0;
        this.cache.trial = 0;
    }

    update() {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.space.isDown) {
            cursors.space.isDown = false;
            this.scene.start('AvoidanceScene', {score: this.scoreVal});
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
export default AvoidanceStart;