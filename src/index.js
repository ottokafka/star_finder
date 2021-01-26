import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import spaceImg from './assets/space.png';
import spaceImgBG from './assets/space_bg.jpeg';

import speakerImg from './assets/speaker.png';
// import theWeekend from './assets/theWeekend.mp3';
import shipImg from './assets/ship.png';
import beamShot1 from './assets/beamShot1.png';
// import shoot from './shoot.js'

var shipWorld = {
    velocity: 8
};
var bullet = {
    velocity: 2
};
class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        // this.load.image('logo', logoImg);
        // this.load.image('space', spaceImg);
        this.load.image('spaceBG', spaceImgBG);

        // load the music
        this.load.image('speaker', speakerImg);
        // this.load.audio('loading', theWeekend);
        this.load.image('ship', shipImg);
        this.load.image('beamShot1', beamShot1);

        // Add key input to the game
        this.keys = this.input.keyboard.createCursorKeys();
        // this.load.image('shoot', shoot);
    }

    create() {
        this.add.image(0, 0, 'spaceBG').setOrigin(0, 0).setScale(1);

        // this.tweens.add({
        //     targets: space,
        //     x: 450,
        //     ease: "Power2",
        //     yoyo: true,
        //     loop: -1
        // });

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
            // music.play()
            // return this.scene.start('PlayScene');
            music.play()
            this.add.image(100, 400, 'ship').setScale(0.6);
            // this.physics.add.image(400, 300, 'ship').setScale(0.1);
        });

        // load the music 
        // this.add.image(780, 580, 'speaker').setScale(.1).setInteractive({ useHandCursor: true }).on('pointerdown', () => music.play());

        // const music = this.sound.add('loading', {
        //     mute: false,
        //     volume: 0.15,
        //     rate: 1,
        //     detune: 0,
        //     seek: 0,
        //     loop: true,
        //     delay: 0,
        // })
        // this.add.image(780, 580, 'speaker').setScale(.1).setInteractive({ useHandCursor: true }).on('pointerdown', () => music.play());

        this.ship = this.add.image(100, 400, 'ship').setScale(0.6);
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
            // this.beamShot1 = this.add.image(this.ship.x, this.ship.y, 'beamShot1')
            // this.beamShot1.x += shipWorld.velocity
            // for (let index = 0; index < 30; index++) {
            //     this.beamShot1.x += bullet.velocity + index
            //     index++
            // }
        }
    }


}


const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
