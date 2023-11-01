var backgrCol; var titleCol; var buttonCol1; var buttonCol2;


//make popup dialog box with instructions and number bar for ratings
export default class RatingPanel {
    constructor(scene, x, y, coin, penalty) {
    this.scene = scene;
    var coin = coin;
    var titleTxt; var mainTxt;
    this.scene.penalty = penalty;
    titleTxt = 'Make a decision!';
    //mainTxt = 'Open chest & Run  \n'+
    //          'OR\n'+
    //          'Exit & Hide\n';

    backgrCol = 0x000000;
    titleCol = 0xba1414;
    buttonCol1 = 0x1165bf;
    buttonCol2 = 0xdb5644;
       
    this.mainPanel = createMainPanel(this.scene, titleTxt, coin)
        .setPosition(x,y)
        .layout()
        .popUp(0); 
    }
    
}

////////////////////functions for making in-scene graphics//////////////////////////
///////////main panel////////////
var createMainPanel = function (scene, titleTxt, coin) {
    console.log(scene.penalty)
    // create components
    var dialog = createDialog(scene, titleTxt);
    var buttons = createButtonBar(scene);
    var mainPanel = scene.rexUI.add.fixWidthSizer({
        orientation: 'x', //vertical stacking\
        align: 'center'
        }).add(
            dialog, //child
            0, // proportion
            'center', // align
            0, // paddingConfig
            false, // expand
        )
        .add(
            buttons, //child
            0, // proportion
            'center', // align
            0, // paddingConfig
            true, // expand
        )
    .layout();
    
    /*
    buttons.on('button.click', function (button, index) {
                if (index == 0){
                    coins = coin;
                }
                else{
                    coins = -2;
                };
                scene.registry.set('coins', coins);   //set final value as global var
                dialog.scaleDownDestroy(100);          //destroy ratings panel components
                buttons.scaleDownDestroy(100);         //destroy ratings panel components
                scene.events.emit('ratingcomplete');   //emit completion event
                }, this)
                .on('button.over', function (button, groupName, index) {
                    button.getElement('background').setStrokeStyle(2, 0xffffff); //when hover
                })
                .on('button.out', function (button, groupName, index) {
                    button.getElement('background').setStrokeStyle();
                });
    */

    var spaceBar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    var x = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);       
    
    spaceBar.once('down', function(){
        scene.registry.set('coins', coin);
        mainPanel.destroy();         
        scene.events.emit('ratingcomplete');
    });

    x.once('down', function(){
        scene.registry.set('coins', -2);
        mainPanel.destroy();
        scene.events.emit('ratingcomplete');
    });

    return mainPanel;
};

///////////popup dialog box//////
var createDialog = function (scene, titleTxt) {
    var textbox = scene.rexUI.add.dialog({
    width: 500,
    height: 50,
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 200, 20, backgrCol),

    content: scene.add.text(0, 0, titleTxt, {
        fontSize: '34px',
        strokeThickness: 0.8,
        align: 'center'
    }),

    space: {
        title: 50,
        content: 10,
        action: 20,
        left: 20,
        right: 20,
        top: 10,
        bottom: 0,
    },
        
    align: 'center',

    expand: {
        content: false, 
    }
    })
    .layout();
    
    return textbox;
};




////////Buttons bar//////////////////////////////////
var createButtonBar = function (scene) {
    var buttons = scene.rexUI.add.buttons({ 
        width: 40,
        height: 10,
        orientation: 'horizontal',

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20),

        buttons: [
            createLabel(scene, "Open chest", buttonCol1),
            createLabel(scene, `Exit\n (${scene.penalty}% coin loss)`, buttonCol2),
        ],
        
        space: {item: 100},
        align: 'center',

        click: {
            mode: 'pointerup',
            clickInterval: 100
        }
        
    })
    .layout();
    
    return buttons;
};
/////////button labels////////////////////////////
var createLabel = function (scene, text, color) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, color),
        text: scene.add.text(0, 0, text, {
            fontSize: '20px',
            strokeThickness: 1,
            align: 'center'
        }),
        align: 'center',
        width: 200,
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
};


