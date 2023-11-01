import GameScene from './GameScene.js';

class AvoidanceScene extends GameScene {

    updateAsteroids() {

        this.hole = 0;
        this.hole2 = 0;

        var max_val = 0;
        this.last_asteroid = null;
        for (let i = 0; i < this.pipes.getChildren().length; i++) {
            var val = Phaser.Math.Between(800, 1000);
            if (i < 5) {
                var vv = this.ship.y;
                this.pipes.getChildren()[i].setX(val);
                this.pipes.getChildren()[i].setY(vv += (30 * (3 - i)));
                this.pipes.getChildren()[i].setVelocity(-1000, 0);
                if (val > max_val) {
                    max_val = val;
                    this.last_asteroid = this.pipes.getChildren()[i];
                }
            }
            else {
                this.pipes.getChildren()[i].setX(99999);

            }
        }

        this.cache.trial += 1;

    }

    addData() {

        this.cache.data.trial.push(this.cache.player_trial);
        this.cache.data.trial_type.push('avoidance');
        this.cache.data.player_y.push(this.ship.y);
        this.cache.data.hole1_y.push(0);
        this.cache.data.hole2_y.push(0);
        //this.cache.game.data.subjectID.push(this.cache.game.subjectID);
        this.cache.data.score.push(this.scoreVal);
        this.cache.data.health.push(this.ship.health);

        //trialData.subjectID = this.cache.game.subjectID;
        
       

    }

    nextPhase() {

        var cursors = this.input.keyboard.createCursorKeys();
        cursors.up.isDown = false;
        cursors.down.isDown = false;

        this.ship.body = false;
        this.pipes.body = false;
        this.fire.body = false;
        this.space.body = false;

        if (!this.topScore) {
            this.topScore = this.scoreVal;
        }

        else if (this.scoreVal > this.topScore) {
            this.topScore = this.scoreVal;
        }

        this.scene.start('EndScene', {score: this.scoreVal, topScore: this.topScore});

    }

    gameOver() {

        var cursors = this.input.keyboard.createCursorKeys();
        cursors.up.isDown = false;
        cursors.down.isDown = false;


        if (!this.topScore) {
            this.topScore = this.scoreVal;
        }

        else if (this.scoreVal > this.topScore) {
            this.topScore = this.scoreVal;
        }

        this.scene.start('GameOver', {score: this.scoreVal, topScore: this.topScore, game: 'avoidance'});

    }

}

export default AvoidanceScene;