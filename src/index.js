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
import shipSpriteSheet from './assets/ship.png';
import shipJson from './assets/ship.json';
import beamShot1 from './assets/beamShot1.png';
import Shoot from './shoot.js'
import playerHit from './assets/playerHit.mp3';
import playerDead from './assets/dead.mp3';
// enemy
import enemySpriteSheet from './assets/enemy.png';
import enemyJson from './assets/enemy1.json';
import badGuy1 from './assets/badGuy1.png'
import EnemyShoot from './enemyShoot.js'
import enemyBeam from './assets/enemyBeam.png'

var shipWorld = {
    velocity: 8
};
var enemyMovement = {
    velocity: 2
};
var timedEvent;
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

        // ------- Player ----------
        // this.load.image('ship', shipImg);
        this.load.image('shoot', beamShot1);
        this.load.atlas("ship", shipSpriteSheet, shipJson);

        // Enemy
        this.load.atlas("enemy", enemySpriteSheet, enemyJson);
        this.load.image('enemyShoot', enemyBeam);
        // this.load.image('badGuy1', badGuy1);
    }

    create() {
        this.add.image(0, 0, 'spaceBG').setOrigin(0, 0).setScale(1);

        this.add.text(280, 350, `Start Finder`, {
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

        // this.badGuy1 = this.physics.add.sprite(300, 100, 'badGuy1');

        // ------- Player ----------
        // this.ship = this.physics.add.sprite(50, 200, 'ship')

        //// SHIP ANIMATION
        this.anims.create({
            key: "fly",
            frameRate: 7,
            frames: this.anims.generateFrameNames('ship', {
                prefix: "ship",
                suffix: ".png",
                start: 1,
                end: 4,
                zeroPad: 1
            }),
            repeat: -1
        });
        this.ship = this.physics.add.sprite(50, 200, "ship");
        this.ship.play("fly");

        // --- Enemy Animation -----
        this.anims.create({
            key: "flyEnemy",
            frameRate: 7,
            frames: this.anims.generateFrameNames('enemy', {
                prefix: "enemy",
                suffix: ".png",
                start: 1,
                end: 3,
                zeroPad: 1
            }),
            repeat: -1
        });
        this.enemy = this.physics.add.sprite(300, 100, "enemy");
        this.enemy.play("flyEnemy");

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
            targets: this.enemy,
            y: 500,
            ease: 'Power1',
            duration: 3000,
            yoyo: true,
            repeat: -1,
            // onStart: function () { console.log('onStart'); },
            // onComplete: function () { console.log('onComplete'); },
            // onYoyo: function () { console.log('onYoyo'); },
            // onRepeat: function () { console.log('onRepeat'); },
        });

        // ship collide with enemy
        this.physics.add.collider(this.ship, this.badGuy1, function (ship, enemy) {
            if (!this.isGameOver) {
                ship.destroy();
                this.isGameOver = true;
            }
        });

        // ship beam collide with enemy
        var enemyHit = this.sound.add('enemyHit');
        var enemyDead = this.sound.add('enemyDead');
        this.physics.add.collider(this.shootsGroup, this.enemy, function (ship, enemy) {
            enemyHit.play();
            if (!this.isGameOver) {
                enemyDead.play();
                ship.destroy();
                this.isGameOver = true;
            }
        });

        // enemy beam collide with ship 
        var health = 20
        var playerHit = this.sound.add('playerHit');
        var playerDead = this.sound.add('playerDead');
        this.physics.add.collider(this.ship, this.enemyShootsGroup, function (ship, enemy) {
            playerHit.play();
            health = health - 1
            console.log(health);

            // timedEvent = this.time.delayedCall(3000, badGuy1, [], this);
            // timedEvent = this.time.addEvent({ delay: 2000, callback: onEvent, callbackScope: this });
            // var timer = ship.time.delayedCall(delay, callback, args, scope);  // delay in ms

            // ship.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            //     console.log("remove a health point")
            // });

            if (health === 0) {
                playerDead.play();
                ship.destroy();
                this.isGameOver = true;
            }

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
            enemyShoot.fire(this.enemy.x, this.enemy.y, this.enemy.rotation);
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