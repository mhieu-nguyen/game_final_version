// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.


export default class Predator3 {
    constructor(scene, x, y) {
    this.scene = scene;
    this.time = this.scene.time.now;
    this.timer = 0;
    // Create animations for the predator (from sprite sheet frames)
    const anims=scene.anims;
    //run right:
    anims.create({
        key: 'prun3',
        frames: anims.generateFrameNumbers('predator3', { start: 0, end: 6 }),
        frameRate: 14    ,  //display 14 frames per second
        repeat: -1      //loop animation
    });
    //idle/waiting:
    anims.create({
        key: 'pwait3',
        frames: [ {key: 'predator3', frame: 6}],
        frameRate: 10  //display 10 frames per second
    });
    //jump:
  
        
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'predator3', 0)
      .setCollideWorldBounds(true)  //prevent running off edges
      .setBounce(0.1)             //bounce values range [0,1]
      .setScale(2);
      //.setDrag(0, 0);
      //.setMaxVelocity(507);    
    // Track the arrow keys
    var { RIGHT } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      right: RIGHT,
    });    
    }
        
    update(predatorTriggered, moving, size, getting_close, delta) {
        const predatorsprite = this.sprite;
        var keyCount = this.scene.registry.get('keyCount');
        var pVelocity = this.scene.registry.get('pVelocity');
        const velocityIncrease = this.scene.registry.get('velocityIncrease');

        predatorsprite.visible = false;
        this.timer+=delta;
        
        if (keyCount>0 && this.timer >= 1000 && moving && !getting_close){
            if (pVelocity < this.scene.registry.get('velocity')){
                pVelocity = this.scene.registry.get('velocity');
            }
            pVelocity += velocityIncrease;
            this.scene.registry.set('pVelocity', pVelocity);
            this.timer = 0;
        }

        if (getting_close && this.scene.registry.get('velocity')>=250){
            if (pVelocity > this.scene.registry.get('velocity')){
                pVelocity = this.scene.registry.get('velocity');
                this.scene.registry.set('pVelocity', pVelocity);
            }
        }

        //update sprite according keyboard input:
        if (predatorTriggered){
            predatorsprite.visible = true;
            predatorsprite.body.moves = true;
            if (keyCount>0 && moving) {
                predatorsprite.setVelocityX(pVelocity);   
                predatorsprite.anims.play('prun3', true);
                predatorsprite.setScale(size);
                predatorsprite.flipX=false; 
                }
            else {
                predatorsprite.setVelocityX(0);       
                predatorsprite.anims.play('pwait3', true);  
                predatorsprite.setScale(size);
            }
        }}
    
    destroy() {
        this.sprite.destroy();
    }

}