// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.


export default class Predator4 {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the player (from sprite sheet frames)
    const anims=scene.anims;
    //run right:
    anims.create({
        key: 'prun4',
        frames: anims.generateFrameNumbers('predator4', { start: 2, end: 9 }),
        frameRate: 12,  //display 10 frames per second
        repeat: -1      //loop animation
    });
    //idle/waiting:
    anims.create({
        key: 'pwait4',
        frames: [ {key: 'predator4', frame: 2}],
        frameRate: 10  //display 10 frames per second
    });
    //jump:
  
        
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'predator4', 0)
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
        
        //for running left/right:
        if (predatorOn == 1){
            predatorsprite.visible = true;
            if (keyCount>0 && moving) {
                predatorsprite.setVelocityX(pVelocity);   //positive horizontal velocity->move R  
                predatorsprite.anims.play('prun4', true);
                predatorsprite.setScale(size);
                predatorsprite.flipX=false; 
                }
            else {
                predatorsprite.setVelocityX(0);          //0 horizontal velocity->still
                predatorsprite.anims.play('pwait4', true);  
                predatorsprite.setScale(size);
            }
        }}
    
    destroy() {
        this.sprite.destroy();
    }

}