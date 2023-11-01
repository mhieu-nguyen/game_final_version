// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Robot0 {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the robot (from sprite sheet frames)
    const anims=scene.anims;
    // walk:
    anims.create({
        key: 'robo0move',
        frames: anims.generateFrameNumbers('robo0', { start: 10, end: 16 }),
        frameRate: 10,          // display 10 frames per second
        repeat: -1              //l oop animation
    });
    // idle/waiting:
    anims.create({
        key: 'robo0wait',
        frames: [ {key: 'robo0', frame: 9}],
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
      .sprite(x, y, 'robo0', 0)
      .setCollideWorldBounds(true)  // prevent running off edges
      .setBounce(0.1);              // bounce values range [0,1]
          
    }
        
    update(robo0On, moving) {
        const roboSprite0 = this.sprite;
        const roboVelocity = 300;
        roboSprite0.visible = false;                // default is invisible
        
        // update sprite:                           // if visibility turned on:
        if (robo0On == 1) {
            roboSprite0.visible = true;
            if (moving) {       // if still to R of this point, move L
                roboSprite0.setVelocityX(-roboVelocity);   // move L
                roboSprite0.anims.play('robo0move', true);
                roboSprite0.flipX=true;              // mirror flip running frames R -> L
                }
            else {                                   // if reached desired point, stop
                roboSprite0.setVelocityX(0);         // 0 horizontal velocity i.e. still
                roboSprite0.anims.play('robo0wait', true);
                roboSprite0.flipX=true;              // mirror flip to face R
                }
        }
        
    }
    
    destroy() {
        this.sprite.destroy();
    }

}