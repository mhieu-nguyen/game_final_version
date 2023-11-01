// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Robot1 {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the robot (from sprite sheet frames)
    const anims=scene.anims;
    // walk:
    anims.create({
        key: 'robo1move',
        frames: anims.generateFrameNumbers('robo1', { start: 10, end: 16 }),
        frameRate: 10,          // display 10 frames per second
        repeat: -1              //l oop animation
    });
    // idle/waiting:
    anims.create({
        key: 'robo1wait',
        frames: [ {key: 'robo1', frame: 9}],
        frameRate: 10,          // display 10 frames per second
    });
    // carry coin (walking):
    //anims.create({
    //    key: 'robo1coinCarry',
    //    frames: anims.generateFrameNumbers('robo1', { start: 17, end: 25 }),
    //    frameRate: 10,          // display 10 frames per second
    //    repeat: -1              // loop animation
    //});
    // carry coin (idle):
    //anims.create({
    //    key: 'robo1coinIdle',
    //    frames: [ {key: 'robo1', frame: 25} ],
    //    frameRate: 10,          // display 10 frames per second
    //}); 
        
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'robo1', 0)
      .setCollideWorldBounds(true)  // prevent running off edges
      .setBounce(0.1);              // bounce values range [0,1]
          
    }
        
    update(robo1On, moving) {
        const roboSprite1 = this.sprite;
        const roboVelocity = 300;
        roboSprite1.visible = false;                // default is invisible
        
        // update sprite:                           // if visibility turned on:
        if (robo1On == 1) {
            roboSprite1.visible = true;
            if (moving) {       // if still to R of this point, move L
                roboSprite1.setVelocityX(-roboVelocity);   // move L
                roboSprite1.anims.play('robo1move', true);
                roboSprite1.flipX=true;              // mirror flip running frames R -> L
                }
            else {                                   // if reached desired point, stop
                roboSprite1.setVelocityX(0);         // 0 horizontal velocity i.e. still
                roboSprite1.anims.play('robo1wait', true);
                roboSprite1.flipX=true;              // mirror flip to face R
                }
        }
        
    }
    
    destroy() {
        this.sprite.destroy();
    }

}