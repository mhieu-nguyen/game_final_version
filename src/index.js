// import js modules that hold the game/experiment scenes
//import EnterID from "./scenes/enterID.js";
import InstructionPanel from "./scenes/InstructionPanel.js";
import QuestionPanel from "./scenes/QuestionPanel.js";
import MidTaskQuestion from "./scenes/MidTaskQuestions.js";
import Question_env4 from "./scenes/Question_env4.js";
import PGNG_Instruction from "./scenes/PGNGInstruction.js";
import day1Scene from "./scenes/day1Scene.js";
import SummaryDay1 from "./scenes/SummaryDay1.js";
import day2Scene from "./scenes/day2Scene.js";
import SummaryDay2 from "./scenes/SummaryDay2.js";
import day3Scene from "./scenes/day3Scene.js";
import SummaryDay3 from "./scenes/SummaryDay3.js";
import day4Scene from "./scenes/day4Scene.js";
import Ending_Win from "./scenes/Ending_Win.js";
import Ending_Lose from "./scenes/Ending_Lose.js";
import GameStart from './scenes/GameStart.js';
import GameScene from './scenes/GameScene.js';
import GameOver from './scenes/GameOver.js';
import EndScene from './scenes/EndScene.js';
import QuestionScene from "./scenes/QuestionScene.js";
import AvoidanceStart from './scenes/AvoidanceStart.js';
import AvoidanceScene from './scenes/AvoidanceScene.js';
import NextPhase from './scenes/NextPhase.js';
import Factory_1 from "./scenes/Factory_1.js";
import Factory_2 from "./scenes/Factory_2.js";
import Factory_v2 from "./scenes/Factory_v2.js";
import PGNG_MidTask from "./scenes/PGNGMidTask.js";
import PGNGEndScene from "./scenes/PGNGEndScene.js";
import PGNGQuestion from "./scenes/PGNGQuestion.js";
import PreTaskQuestion from "./scenes/PreTaskQuestions.js";

var game = new GameScene('GameScene');
var avoidance = new AvoidanceScene('AvoidanceScene');
var gameover = new GameOver("GameOver");
var nextphase = new NextPhase("NextPhase"); 
var scene1 = new day1Scene('day1Scene_0');
var scene2 = new day2Scene('day2Scene_0');
var scene3 = new day3Scene('day3Scene_0');
var scene4 = new day4Scene('day4Scene_0');
var factory1_1 = new Factory_1('Factory1_set1');
var factory1_2 = new Factory_1('Factory1_set2');
var factory2_1 = new Factory_2('Factory2_set1');
var factory2_2 = new Factory_2('Factory2_set2');
var factory = new Factory_v2('Factory_v2');
var preTask_Q = new PreTaskQuestion('PreTaskQuestion');
var postTask_Q = new PreTaskQuestion('PostTaskQuestion');
var Q_env1 = new MidTaskQuestion('Question_env1');
var Q_env2 = new MidTaskQuestion('Question_env2');
var Q_env3 = new MidTaskQuestion('Question_env3');

// create the phaser game, based on the following config
const config = {
    type: Phaser.AUTO,           //how will this be rendered? webGL if available, otherwise canvas
    antialiasGL: false,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',       //add light-weight physics to world
        arcade: {
            gravity: { y: 2000 }, //need some gravity for a side-scrolling platformer
            debug: false,         //turn on to help debug game physics
            blocked: false

        }
    },
    parent: 'game-container',    //ID of the DOM element to add the canvas to
    dom: {
        createContainer: true    //to allow text input DOM element
    },
    //backgroundColor: "#16bdf0",
    scene: [InstructionPanel,
            preTask_Q,
            scene1,
            SummaryDay1,
            Q_env1,
            scene2,
            SummaryDay2,
            Q_env2,
            scene3,
            SummaryDay3,
            Q_env3,
            scene4, 
            Ending_Win,
            Question_env4,
            postTask_Q,
            Ending_Lose,
            QuestionPanel,
            PGNG_Instruction,
            factory,
            //factory1_1,
            //factory1_2,
            //PGNG_MidTask,
            //factory2_1,
            //factory2_2,
            PGNGQuestion,
            PGNGEndScene,
            GameStart,
            game,
            gameover,
            nextphase,
            AvoidanceStart,
            avoidance,
            EndScene,
            QuestionScene
            ], 
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: rexuiplugin, //load the UI plugins here for all scenes
            mapping: 'rexUI'
        }]
    }
};

var game = new Phaser.Game(config); //create new game with config as above

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Sorry, this game does not work on mobile devices");  //test this works!
}
