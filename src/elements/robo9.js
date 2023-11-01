// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Robot9 {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the robot (from sprite sheet frames)
    const anims=scene.anims;
    // walk:
    anims.create({
        key: 'robo9move',
        frames: anims.generateFrameNumbers('robo9', { start: 10, end: 16 }),
        frameRate: 10,          // display 10 frames per second
        repeat: -1              //l oop animation
    });
    // idle/waiting:
    anims.create({
        key: 'robo9wait',
        frames: [ {key: 'robo9', frame: 9}],
        frameRate: 10,          // display 10 frames per second
    });
    
    this.sprite = scene.physics.add
      .sprite(x, y, 'robo9', 0)
      .setCollideWorldBounds(true)  // prevent running off edges
      .setBounce(0.1);              // bounce values range [0,1]
          
    }
        
    update( robo9On, moving) {
        const roboSprite7 = this.sprite;
        const roboVelocity = 300;
        roboSprite7.visible = false;                // default is invisible
        
        // update sprite:                           // if visibility turned on:
        if ( robo9On == 1) {
            roboSprite7.visible = true;
            if (moving) {       // if still to R of this point, move L
                roboSprite7.setVelocityX(-roboVelocity);   // move L
                roboSprite7.anims.play('robo9move', true);
                roboSprite7.flipX=true;              // mirror flip running frames R -> L
                }
            else {                                   // if reached desired point, stop
                roboSprite7.setVelocityX(0);         // 0 horizontal velocity i.e. still
                roboSprite7.anims.play('robo9wait', true);
                roboSprite7.flipX=true;              // mirror flip to face R
                }
        }
        
    }
    
    destroy() {
        this.sprite.destroy();
    }

}