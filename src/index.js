import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import spaceImg from './assets/space.png';
import spaceImgBG from './assets/space_bg.jpeg';

import speakerImg from './assets/speaker.png';
// import theWeekend from './assets/theWeekend.mp3';
// sound
import laser from './assets/laser.mp3';
import enemyHit from './assets/hit.mp3';
import enemyDead from './assets/smashing.mp3';
// Player
import shipImg from './assets/ship.png';
import beamShot1 from './assets/beamShot1.png';
import Shoot from './shoot.js'
import playerHit from './assets/playerHit.mp3';
import playerDead from './assets/dead.mp3';
// enemy
import badGuy1 from './assets/badGuy1.png'
import EnemyShoot from './enemyShoot.js'
import enemyBeam from './assets/enemyBeam.png'

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
        // Audio
        this.load.audio('laser', laser);
        this.load.audio('enemyHit', enemyHit);
        this.load.audio('enemyDead', enemyDead);
        this.load.audio('playerHit', playerHit);
        this.load.audio('playerDead', playerDead);

        // Add key input to the game
        this.keys = this.input.keyboard.createCursorKeys();
        this.load.image('spaceBG', spaceImgBG);

        // Player
        this.load.image('ship', shipImg);
        this.load.image('shoot', beamShot1);
        // Enemy
        this.load.image('enemyShoot', enemyBeam);
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

        // enemy shoot 
        this.enemyShootsGroup = this.physics.add.group({
            classType: EnemyShoot,
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

        // ship collide with enemy
        this.physics.add.collider(this.ship, this.badGuy1, function (ship, badGuy1) {
            if (!this.isGameOver) {
                ship.destroy();
                this.isGameOver = true;
            }
        });

        // ship beam collide with enemy
        var enemyHit = this.sound.add('enemyHit');
        var enemyDead = this.sound.add('enemyDead');
        this.physics.add.collider(this.shootsGroup, this.badGuy1, function (ship, badGuy1) {
            enemyHit.play();
            if (!this.isGameOver) {
                enemyDead.play();
                ship.destroy();
                this.isGameOver = true;
            }
        });

        // enemy beam collide with ship 
        var playerHit = this.sound.add('playerHit');
        var playerDead = this.sound.add('playerDead');
        this.physics.add.collider(this.enemyShootsGroup, this.ship, function (ship, badGuy1) {
            playerHit.play();
            if (!this.isGameOver) {
                playerDead.play();
                ship.destroy();
                this.isGameOver = true;
            }
        });


    }


    update() {
        const enemyShoot = this.enemyShootsGroup.get();
        if (enemyShoot) {
            enemyShoot.fire(this.badGuy1.x, this.badGuy1.y, this.badGuy1.rotation);
        }

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
            var beamSound = this.sound.add('laser');
            if (shoot) {
                shoot.fire(this.ship.x, this.ship.y, this.ship.rotation);
                beamSound.play();
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