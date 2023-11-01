// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Chest {
    constructor(scene, x, y, chestOn) {
    this.scene = scene;
    
    // Create animations for the robot (from sprite sheet frames)
    const anims=scene.anims;
    //idle/waiting:
    
    //chest open:
    anims.create({
        key: 'chestopen',
        frames: anims.generateFrameNumbers('chest', { start: 0, end: 5 }),
        frameRate: 10,  //display 10 frames per second
    });

    anims.create({
        key: 'chestIdle',
        frames: [ {keys: 'chest', frame: 0} ],
        frameRate: 10,  //display 10 frames per second
    });
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'chest', 0)
      .setScale(3)
      .setCollideWorldBounds(true)  //prevent running off edges
      .setBounce(0.1);              //bounce values range [0,1]
          
    }
        
    update(chestOn) {
        const chestSprite = this.sprite;
        //const roboVelocity = 100;
        chestSprite.visible = false;            //default is invisible
        
        //update sprite:                        //if visibility turned on:
        if (chestOn == 1) {
            chestSprite.visible = true;
            chestSprite.anims.play('chestIdle', true);
        }
        
        if (chestOn == 2) {                         //for open chest outcome:
            chestSprite.visible = true;
            chestSprite.setVelocityX(0);                   //keep still
            chestSprite.anims.play('chestopen', true); //show carrying coins
            chestSprite.flipX=true;
        }
    }
    destroy() {
        this.sprite.destroy();
    }

}