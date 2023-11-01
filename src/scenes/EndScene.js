export default class EndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'EndScene',
        });
    }

    init(data) {
        this.scoreVal = data.score;
        this.topScore = data.topScore;
    }

    create() {
        this.text = this.add.text();
        this.text.x = 400;
        this.text.y = 300;
        this.text.originX = 0.5;
        this.text.originY = 0.5;
        
        this.text.setText('End of the task!\n\n\n\n' +
                          'Top score: ' + this.topScore);
        this.text.setAlign('center');

        var csv = "";
        var header = this.cache.dataKeys;
        var subID = this.cache.subID;
        

        for (var h = 0; h < header.length; h++) {
            if (h > 0)
                csv = csv + ', ';
            csv = csv + header[h];
        }
        
        const data_length = this.cache.data.trial_type.length;
        csv = csv + '\n';
        for (var r = 0; r < data_length; r++) {
            for (var h = 0; h < header.length; h++) {
                if (h > 0)
                    csv = csv + ', ';
                csv = csv + this.cache.data[header[h]][r];
            }
            csv = csv + '\n';
        }
        const upload = async function (csv,filepath){
            try{
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');

                const apiResult = await fetch(
                        "https://qsj3v6s9ig.execute-api.us-east-1.amazonaws.com/default/avoidance-learning-task",
                            { headers: headers,
                              method: "POST",
                              body: JSON.stringify({result:csv, filepath: filepath}),
                            }
                );
                console.log(apiResult.status);
                console.log(await apiResult.text());
                }catch (error) {console.error("Error:", error);}}

        var date = new Date();
        var month = date.getMonth()+1;       
        var filepath = `data/subject_${this.cache.subID}/${this.cache.subID}_${date.getDate()}_${month}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_AversiveLearning.csv`;
        upload(csv, filepath);

        this.text2 = this.add.text();
        this.text2.x = 400;
        this.text2.y = 550;
        this.text2.originX = 0.5;
        this.text2.originY = 0.5;


        this.text2.setText('\nPress SPACE BAR to continue\n');
        this.text2.setAlign('center');
        this.text2.setStyle({backgroundColor: '#000000', fontSize: '24px'});

        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.once('down', function(){
    
        let timer = this.time.addEvent({delay: 1000, 
                                        callback: this.nextScene(),
                                        loop: false});
        }, this);
    }

    update() {
    }
    nextScene(){
        this.scene.start('QuestionScene');
    }
}
