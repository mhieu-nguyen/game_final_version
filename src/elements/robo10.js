// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Robot10 {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the robot (from sprite sheet frames)
    const anims=scene.anims;
    // walk:
    anims.create({
        key: 'robo10move',
        frames: anims.generateFrameNumbers('robo10', { start: 10, end: 16 }),
        frameRate: 10,          // display 10 frames per second
        repeat: -1              //l oop animation
    });
    // idle/waiting:
    anims.create({
        key: 'robo10wait',
        frames: [ {key: 'robo10', frame: 9}],
        frameRate: 10,          // display 10 frames per second
    });
   
    this.sprite = scene.physics.add
      .sprite(x, y, 'robo10', 0)
      .setCollideWorldBounds(true)  // prevent running off edges
      .setBounce(0.1);              // bounce values range [0,1]
          
    }
        
    update(robo10On, moving) {
        const roboSprite4 = this.sprite;
        const roboVelocity = 300;
        roboSprite4.visible = false;                // default is invisible
        
        // update sprite:                           // if visibility turned on:
        if (robo10On == 1) {
            roboSprite4.visible = true;
            if (moving) {       // if still to R of this point, move L
                roboSprite4.setVelocityX(-roboVelocity);   // move L
                roboSprite4.anims.play('robo10move', true);
                roboSprite4.flipX=true;              // mirror flip running frames R -> L
                }
            else {                                   // if reached desired point, stop
                roboSprite4.setVelocityX(0);         // 0 horizontal velocity i.e. still
                roboSprite4.anims.play('robo10wait', true);
                roboSprite4.flipX=true;              // mirror flip to face R
                }
        }
        
    }
    
    destroy() {
        this.sprite.destroy();
    }

}