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
var enemyMovement = {
    velocity: 2
};
class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('spaceBG', spaceImgBG);

        this.load.image('ship', shipImg);

        // Add key input to the game
        this.keys = this.input.keyboard.createCursorKeys();
        this.load.image('shoot', beamShot1);
        this.load.image('badGuy1', badGuy1);
    }

    create() {
        this.add.image(0, 0, 'spaceBG').setOrigin(0, 0).setScale(1);

        this.add.text(280, 350, `Otto`, {
            fontSize: '32px',
            fill: '#FF0000',
            fontStyle: 'bold',
        });
        this.add.text(225, 400, `Click Here To Play!`, {
            fontSize: '32px',
            fill: '#FF0000',
            fontStyle: 'bold',
        }).setInteractive({ useHandCursor: true }).on('pointerdown', () => {

            this.physics.add.image(100, 400, 'ship').setScale(0.6);
            // this.physics.add.image(400, 300, 'ship').setScale(0.1);
        });

        this.ship = this.physics.add.sprite(50, 500, 'ship').setScale(0.6);
        // this.add.image(100, 100, 'badGuy1').setScale(0.6);
        this.badGuy1 = this.physics.add.sprite(300, 100, 'badGuy1');


        // shoot 
        this.shootsGroup = this.physics.add.group({
            classType: Shoot,
            maxSize: 1,
            runChildUpdate: true,
        });

        // this.physics.add.overlap(this.shootsGroup, this.badGuy1, this.collision, null, this);

        // enemy
        this.tweens.add({
            targets: this.badGuy1,
            y: 500,
            ease: 'Power1',
            duration: 3000,
            yoyo: true,
            repeat: 100,
            // onStart: function () { console.log('onStart'); },
            // onComplete: function () { console.log('onComplete'); },
            // onYoyo: function () { console.log('onYoyo'); },
            // onRepeat: function () { console.log('onRepeat'); },
        });

        this.physics.add.collider(this.ship, this.badGuy1, function (ship, badGuy1) {
            if (!this.isGameOver) {
                ship.destroy();
                this.isGameOver = true;
            }
        });

        this.physics.add.collider(this.shootsGroup, this.badGuy1, function (ship, badGuy1) {
            if (!this.isGameOver) {
                ship.destroy();
                this.isGameOver = true;
            }
        });
    }


    update() {

        // Poll the arrow keys to move the ship
        if (this.keys.left.isDown) {
            this.ship.x -= shipWorld.velocity;
        }
        if (this.keys.right.isDown) {
            this.ship.x += shipWorld.velocity;
        }
        if (this.keys.up.isDown) {
            this.ship.y -= shipWorld.velocity;
        }
        if (this.keys.down.isDown) {
            this.ship.y += shipWorld.velocity;
        }

        if (this.keys.space.isDown) {
            const shoot = this.shootsGroup.get();
            if (shoot) {
                shoot.fire(this.ship.x, this.ship.y, this.ship.rotation);
            }
        }
    }
}


const config = {
    scene: MyGame,
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    audio: {
        disableWebAudio: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: { y: 0 },
        }
    },
};

const game = new Phaser.Game(config);