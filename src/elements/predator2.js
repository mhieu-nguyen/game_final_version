// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.


export default class Predator2 {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the player (from sprite sheet frames)
    const anims=scene.anims;
    //run right:
    anims.create({
        key: 'p2run',
        frames: anims.generateFrameNumbers('predator2', { start: 0, end: 7 }),
        frameRate: 12,  //display 10 frames per second
        repeat: -1      //loop animation
    });
    //idle/waiting:
    anims.create({
        key: 'p2wait',
        frames: [ {key: 'predator2', frame: 1}],
        frameRate: 10  //display 10 frames per second
    });
    //jump:
  
        
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'predator2', 0)
      .setCollideWorldBounds(true)  //prevent running off edges
      .setBounce(0.1)             //bounce values range [0,1]
      .setScale(2);
      //.setDrag(1000, 0)
      //.setMaxVelocity(300, 400);    
    // Track the arrow keys
    var { RIGHT } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      right: RIGHT,
    });    
    }
        
    update(predatorOn, moving, pVelocity, size) {
        const predatorsprite = this.sprite;
        var keyCount = this.scene.registry.get('keyCount');
        var pVelocity = this.scene.registry.get('pVelocity');
        predatorsprite.visible = false;
        
        //update sprite according keyboard input
        if (predatorOn == 1){
            predatorsprite.visible = true;
            if (keyCount>0 && moving) {
                predatorsprite.setVelocityX(pVelocity);   //positive horizontal velocity->move R  
                predatorsprite.anims.play('p2run', true);
                predatorsprite.setScale(size);
                predatorsprite.flipX=false; 
                }
            else {
                predatorsprite.setVelocityX(0);          //0 horizontal velocity->still
                predatorsprite.anims.play('p2wait', true);  
                predatorsprite.setScale(size);
            }
        }}
    
    destroy() {
        this.sprite.destroy();
    }

}