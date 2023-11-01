// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.

export default class LoseCoin {
    constructor(scene, x, y) {
        this.scene = scene;

        this.sprite = scene.physics.add.group({       //create dynamic physics group
                key: 'coin',                          //of coins
                repeat: 20,                           //creates n+1 children
                setXY: { x: x, 
                         y: y, 
                         stepX: 7                     //scatters children along X
                       }                        
                });

        var loseCoins = this.sprite;    
        this.sprite.visible = false;

        loseCoins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));  //adds random bounce
            child.setScale(Phaser.Math.FloatBetween(1,1.4));      //adds random scaling
            child.setGravityY(Phaser.Math.FloatBetween(0,300));   //adds random gravity
            });

    }

    update() {
    }
    
    destroy() {
        this.sprite.getChildren().map(child => child.setVisible(false));
    }

}