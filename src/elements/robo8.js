// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Robot8 {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the robot (from sprite sheet frames)
    const anims=scene.anims;
    // walk:
    anims.create({
        key: 'robo8move',
        frames: anims.generateFrameNumbers('robo8', { start: 10, end: 16 }),
        frameRate: 10,          // display 10 frames per second
        repeat: -1              //l oop animation
    });
    // idle/waiting:
    anims.create({
        key: 'robo8wait',
        frames: [ {key: 'robo8', frame: 9}],
        frameRate: 10,          // display 10 frames per second
    });
   
    this.sprite = scene.physics.add
      .sprite(x, y, 'robo8', 0)
      .setCollideWorldBounds(true)  // prevent running off edges
      .setBounce(0.1);              // bounce values range [0,1]
          
    }
        
    update( robo8On, moving) {
        const roboSprite6 = this.sprite;
        const roboVelocity = 300;
        roboSprite6.visible = false;                // default is invisible
        
        // update sprite:                           // if visibility turned on:
        if ( robo8On == 1) {
            roboSprite6.visible = true;
            if (moving) {       // if still to R of this point, move L
                roboSprite6.setVelocityX(-roboVelocity);   // move L
                roboSprite6.anims.play('robo8move', true);
                roboSprite6.flipX=true;              // mirror flip running frames R -> L
                }
            else {                                   // if reached desired point, stop
                roboSprite6.setVelocityX(0);         // 0 horizontal velocity i.e. still
                roboSprite6.anims.play('robo8wait', true);
                roboSprite6.flipX=true;              // mirror flip to face R
                }
        }
        
    }
    
    destroy() {
        this.sprite.destroy();
    }

}