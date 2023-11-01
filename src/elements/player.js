// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.
var keyPressTime = []; 
var distance = [];
var speed = [];
var velocityIncreaseOnDown = 5;
var speedPenalty = 7.5;
//var velocityPenalty = 10;
export default class Player {
    constructor(scene, x, y) {
    this.scene = scene;
    this.keyTime = this.scene.time.now;
    // Create animations for the player (from sprite sheet frames)
    const anims=scene.anims;
    this.decreaseCount = 0;
    //run right:
    anims.create({
        key: 'run',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 9 }),
        frameRate: 14,  
        repeat: -1      //loop animation
    });
    //idle/waiting:
    anims.create({
        key: 'wait',
        frames: [ {key: 'player', frame: 6}],
        frameRate: 10
    });
    //jump:
  
        
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'player', 0)
      .setCollideWorldBounds(true)  //prevent running off edges
      .setBounce(0.1)             //bounce values range [0,1]
      .setDrag(0, 0);
      //.setMaxVelocity(300, 400);
         
    // Track the arrow keys
    var { RIGHT } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      right: RIGHT,
    });    
    }
        
    update(moving, chestCount, getting_close) {
        const sprite = this.sprite;
        //const cursors = this.keys;
        var keyCount = this.scene.registry.get('keyCount'); 
        var velocity = this.scene.registry.get('velocity');
        var pVelocity = this.scene.registry.get('pVelocity');
        const velocityIncrease = this.scene.registry.get('velocityIncrease')
        var predator_position = this.scene.predator.sprite.body.position.x;
        this.scene.registry.set('player_position', this.sprite.body.position.x);

        if (Phaser.Input.Keyboard.JustDown(this.keys.right) && moving){
            this.decreaseCount = 1
            if (keyCount>0){
                keyPressTime[keyCount] = Math.round(this.keys.right.timeDown-this.keyTime);
                distance[keyCount] = (this.sprite.body.position.x - predator_position).toFixed(2);
                speed[keyCount] = velocity;
                velocity += velocityIncreaseOnDown;
                if (pVelocity < velocity && !getting_close){
                    pVelocity += velocityIncrease;
                }
                this.scene.registry.set('velocity', velocity);
                this.scene.registry.set('pVelocity', pVelocity);
            }
            else{
                keyPressTime = [];
                distance = [];
                speed = [];
                keyPressTime[0] = 0;
                speed[0] = 0;
                distance[0] = 0;
            }
            this.scene.registry.set('distance', distance);
            this.scene.registry.set('keyTimes', keyPressTime);
            this.scene.registry.set('speed', speed);
            this.keyTime = this.keys.right.timeDown;
            keyCount++;
            this.scene.registry.set('keyCount', keyCount);
        }

        if ((this.sprite.body.position.x - predator_position)<180 && chestCount>0){
            this.scene.predator.sprite.body.position.x = this.sprite.body.position.x-180;
        }
    
        if (keyCount>0 && (this.scene.time.now - this.keyTime)>=1000*this.decreaseCount && moving && velocity>=100){
            velocity -= speedPenalty;
            this.scene.registry.set('velocity', velocity);
            this.decreaseCount++;
        }

        //update sprite according keyboard input:
        //for running:
        
        if (keyCount>0 && moving) {
            sprite.setVelocityX(velocity);   //positive horizontal velocity->move R
            sprite.anims.play('run', true);
            sprite.flipX=false; 
            }
        else {
            sprite.setVelocityX(0);          //0 horizontal velocity->still
            sprite.anims.play('wait');
            }
    }
    
    destroy() {
        this.sprite.destroy();
    }

}