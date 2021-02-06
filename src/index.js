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
import shipShieldsSpriteSheet from './assets/shipShields.png';
import shipShieldsJson from './assets/shipShields.json';
import beamShot1 from './assets/beamShot1.png';
import Shoot from './shoot.js'
import playerHit from './assets/playerHit.mp3';
import playerDead from './assets/dead.mp3';
import heart from './assets/health/heart.png';
import shieldsLogo from './assets/health/shields.png';
// enemy
import enemySpriteSheet from './assets/enemy.png';
import enemyJson from './assets/enemy1.json';
import badGuy1 from './assets/badGuy1.png'
import EnemyShoot from './enemyShoot.js'
import enemyBeam from './assets/enemyBeam.png'

var shipWorld = {
    velocity: 8
};
// player
var health = 10
var shields = 1
//enemy
var enemyHealth = 20
var isGameOver = false
var enemyDestroyed = false;
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
        this.load.atlas("shipShields", shipShieldsSpriteSheet, shipShieldsJson);
        this.load.image('shieldsLogo', shieldsLogo);
        this.load.image('heart', heart);

        // Enemy
        this.load.atlas("enemy", enemySpriteSheet, enemyJson);
        this.load.image('enemyShoot', enemyBeam);
        // this.load.image('badGuy1', badGuy1);
    }

    create() {
        this.add.image(0, 0, 'spaceBG').setOrigin(0, 0).setScale(1);

        // heart data
        const heart = this.add.image(20, 20, 'heart');
        const heartPercent = this.add.text(30, 11, '', { font: '16px Courier', fill: '#00ff00' });
        heart.setDataEnabled();
        heart.data.set('heartAmount', health);
        heartPercent.setText([
            '' + heart.data.get('heartAmount'),
        ]);
        
        const shieldBanner = this.add.image(80, 20, 'shieldsLogo');
        const shieldsPercent = this.add.text(90, 10, '', { font: '16px Courier', fill: '#00ff00' });
        //  Store some data about this shield:
        shieldBanner.setDataEnabled();
        shieldBanner.data.set('shieldAmount', shields);
        shieldsPercent.setText([
            'Shields: ' + shieldBanner.data.get('shieldAmount'),
        ]);


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

        // Shields
        this.anims.create({
            key: "shields",
            frameRate: 8,
            frames: this.anims.generateFrameNames('shipShields', {
                prefix: "shields",
                suffix: ".png",
                start: 1,
                end: 12,
                zeroPad: 1
            }),
            repeat: 1
        });

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
        // this.enemyShoot = this.physics.add.sprite("enemyShoot");
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
        this.physics.add.collider(this.enemy, this.shootsGroup, function (enemy) {
            enemyHit.play();
            enemyHealth = enemyHealth - 1
            console.log(enemyHealth);
            if (enemyHealth <= 0) {
                enemyDead.play();
                enemy.destroy();
                enemyDestroyed = true
            }
        });

        // enemy beam collide with ship 
        var playerHit = this.sound.add('playerHit');
        var playerDead = this.sound.add('playerDead');
        this.physics.add.collider(this.ship, this.enemyShootsGroup, function (ship, enemyShootsGroup) {
            playerHit.play();
            ship.play("shields");
            ship.on('animationcomplete', () => {
                ship.play("fly");
            });

            // Deduct shield Damage 
            shieldBanner.on('changedata-shieldAmount', function (gameObject, value) {
                shieldsPercent.setText([
                    'Shields: ' + shieldBanner.data.get('shieldAmount'),
                ]);
            });
            shields = shields - 1
            shieldBanner.data.values.shieldAmount = shields;

            if (shields <= 0) {
                shieldBanner.data.values.shieldAmount = 0;
              
                heart.on('changedata-heartAmount', function (gameObject, value) {
                    heartPercent.setText([
                        ' ' + heart.data.get('heartAmount'),
                    ]);
                });
                health = health - 1
                heart.data.values.heartAmount = health;
            }

            if (health <= 0) {
                heart.data.values.heartAmount = 0;
                playerDead.play();
                ship.destroy();
                isGameOver = true;
            }
        });
    }

    onEvent() {
        this.ship.rotation += 0.04;
    }


    update() {
        var enemyShoot = this.enemyShootsGroup.get();
        if (enemyShoot) {
            if (enemyDestroyed == false) {
                enemyShoot.fire(this.enemy.x, this.enemy.y, this.enemy.rotation);
            }
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
                if (isGameOver != true) {
                    shoot.fire(this.ship.x, this.ship.y, this.ship.rotation);
                    beamSound.play();
                }
              
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