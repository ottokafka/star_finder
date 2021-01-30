import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import spaceImg from './assets/space.png';
import spaceImgBG from './assets/space_bg.jpeg';

import speakerImg from './assets/speaker.png';
// import theWeekend from './assets/theWeekend.mp3';
import shipImg from './assets/ship.png';
import beamShot1 from './assets/beamShot1.png';
import badGuy1 from './assets/badGuy1.png'
import Shoot from './shoot.js'

var shipWorld = {
    velocity: 8
};

const phaserConfig = {
    type: Phaser.AUTO,
    parent: "game",
    width: 1280,
    height: 720,
    backgroundColor: "#5DACD8",
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: {
        init: initScene,
        preload: preloadScene,
        create: createScene,
        update: updateScene
    }
};

const game = new Phaser.Game(phaserConfig);

var ship, obstacle;
var isGameOver = false;

function initScene() { }

function preloadScene() {
    // this.load.atlas("ship", "ship.png", "ship.json");
    this.keys = this.input.keyboard.createCursorKeys();
    this.load.image('shoot', beamShot1);

    this.load.image("ship", shipImg);
    this.load.image("obstacle", badGuy1);
}

function createScene() {


    // Animations ...

    ship = this.physics.add.sprite(300, 360, "ship");
    // ship.play("fly");

    obstacle = this.physics.add.sprite(1100, 360, "obstacle");

    this.physics.add.collider(ship, obstacle, function (ship, obstacle) {
        if (!isGameOver) {
            ship.destroy();
            isGameOver = true;
        }
    });
}

function updateScene() {
    obstacle.x -= 4;
    // Poll the arrow keys to move the ship
    if (keys.left.isDown) {
        ship.x -= shipWorld.velocity;
    }
    if (keys.right.isDown) {
        ship.x += shipWorld.velocity;
    }
    if (keys.up.isDown) {
        ship.y -= shipWorld.velocity;
    }
    if (keys.down.isDown) {
        ship.y += shipWorld.velocity;
    }

    if (keys.space.isDown) {
        // const shoot = this.shootsGroup.get();
        // if (shoot) {
        //     shoot.fire(this.ship.x, this.ship.y, this.ship.rotation);
        // }
    }
}
