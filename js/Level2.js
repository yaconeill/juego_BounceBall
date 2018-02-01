EnemySphere = function (index, game, x, y, type, radius) {
    this.sphere = game.add.sprite(x, y, type);
    this.sphere.anchor.setTo(0.5, 0.5);
    this.sphere.name = index.toString();

    game.physics.enable(this.sphere, Phaser.Physics.P2JS);
    this.sphere.body.collideWorldBounds = true;
    this.sphere.body.setCircle(radius);
    game.physics.p2.setBounds(64, 64, 880, 505, true, true, true, true);
};
EnemyBomb = function (index, game, x, y, type, radius) {
    this.weapon = game.add.sprite(x, y, type);
    this.weapon.anchor.setTo(0.5, 0.5);
    this.weapon.name = index.toString();

    game.physics.enable(this.weapon, Phaser.Physics.P2JS);
    this.weapon.body.collideWorldBounds = true;
    this.weapon.body.setCircle(radius);
    game.physics.p2.setBounds(64, 64, 880, 505, true, true, true, true);
};
Game.Level2 = function (game) {
};
//#region - variables
var map2;
var layer;
var enemy1;
var enemyMini1;
var enemyMini2;
var liveCounter = 5;
var player;
var controls = {};
var jumpTimer = 0;
var button;
var worldMaterial;
var shootTime = 0;
var bomb;
var explosion;
var sndShoot;
var customBounds;
var Score = 0;
var scoreText;
var bonusText;
var endLevelText;
var endGameText;
var avatar;
var lives;
var bounces;
var bombing;
// const livePosition = 780;
var initPlayer = {
    x: 400,
    y: 500
};
// var gameXPsteps = 0;
var yAxis = p2.vec2.fromValues(0, 1);

var playerLevel = 0;
//#endregion
Game.Level2.prototype = {
    create: function () {
        var game = this;
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = 500;
        this.stage.backgroundColor = '#3A5963';
        map2 = this.add.tilemap('map2');
        map2.addTilesetImage('tileset');
        sndShoot = this.add.audio('shoot');
        customBounds = {left: null, right: null, top: null, bottom: null};

        layer = map2.createLayer('field');
        layer.resizeWorld();

        this.createPlayer();

        this.createSphere();
        // this.createWeapon();
        this.createBullets();
        game.physics.p2.convertTilemap(map2, layer);

        controls = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            up: this.input.keyboard.addKey(Phaser.Keyboard.W),
            shoot: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        };
        scoreText = game.add.text(780, 50, 'score: 0', {fontSize: '32px', fill: '#fff'});
        avatar = game.add.sprite(700, 50, 'avatar');
        avatar.width = 64;
        avatar.height = 64;
        this.game.time.events.add(3000, function () {
            let rndX = randomLocation();
            game.createBomb(rndX, 0);
        });
        bounces = 0;
        this.liveIndicator();
    },
    update: function () {
        var game = this;
        scoreText.text = 'Score: ' + Score;
        if (bomb !== undefined && bomb !== null) {
            bomb.weapon.animations.play('turn');
            if (Math.floor(bomb.weapon.position.y) === 540 && bomb.weapon.alive) {
                explosion.animations.play('boom');
                bomb.weapon.kill();
            }
            if (bomb.weapon.body !== null && player.alive)
                bomb.weapon.body.createBodyCallback(player, this.hitPlayer, this);
        }

        if (liveCounter !== 0 && player.alive) {
            if (Math.floor(enemy1.sphere.position.y) > 540) {
                bounces++;
            }
            if (bounces > 8) {
                this.hitPlayer(enemy1.sphere, player.body);
            }

            enemy1.sphere.body.createBodyCallback(player, this.hitPlayer, this);
            if (enemyMini1 !== null && enemyMini1 !== undefined) {
                if (enemyMini1.sphere.body !== null && enemyMini1.sphere.body !== undefined) {
                    enemyMini1.sphere.body.createBodyCallback(player, this.hitPlayer, this);
                    enemyMini2.sphere.body.createBodyCallback(player, this.hitPlayer, this);

                }
            }

            if (!enemy1.sphere.alive)
                if (!enemyMini1.sphere.alive && !enemyMini2.sphere.alive) {
                    player.animations.play('shoot');
                    endLevelText = this.add.text(380, 264, 'Fin del nivel 1', {fontSize: '32px', fill: '#fff'});
                    scoreText = this.add.text(380, 294, 'score: ' + Score, {fontSize: '32px', fill: '#fff'});
                    bonusText = this.add.text(380, 324, 'Bonus vida: x' + liveCounter + ' ' + Score * liveCounter, {
                        fontSize: '32px',
                        fill: '#fff'
                    });
                    this.game.time.events.add(1000, function () {
                        game.add.text(380, 360, 'Cargando siguiente nivel...', {
                            fontSize: '25px',
                            fill: '#fff'
                        });
                    });
                    this.game.time.events.add(3000, function () {
                        Score = Score * liveCounter;
                        game.state.start('Level3');
                    });
                }

            // this.bullets.forEach(function (e) {
            //     if (e.position.y < 80)
            //         e.kill();
            // }, this);
            this.bullets.forEach(function (e) {
                if (e.position.y < 85 || e.position.y > 535)
                    e.kill();
            }, this);

            if (Math.round(player.body.velocity.x) === 0 && Math.round(player.body.velocity.y) === 0)
                player.animations.play('idle');

            if (controls.right.isDown) {
                player.animations.play('run');
                player.scale.setTo(1, 1);
                player.body.moveRight(250);
                // var sndWalk = this.add.audio('walk');
                // sndWalk.play();
            }

            if (controls.left.isDown) {
                player.animations.play('run');
                player.scale.setTo(-1, 1);
                player.body.moveLeft(250);
                // var sndWalk2 = this.add.audio('walk');
                // sndWalk2.play();
            }
            if (controls.shoot.isDown && player.alive/* && Math.round(player.body.velocity.x) === 0*/) {
                // player.animations.play('shoot');
                sndShoot.play();
                this.fireBullet();
                player.frame = 34;
            }

            if (controls.up.isDown && this.time.now > jumpTimer && checkIfCanJump(this)) {
                player.body.moveUp(350);
                player.animations.play('jump');
                jumpTimer = this.time.now + 750;
            }
        } else {
            endGameText = this.add.text(380, 264, 'Fin del juego', {fontSize: '32px', fill: '#fff'});
        }
    },
    createPlayer: function () {
        player = this.add.sprite(initPlayer.x, initPlayer.y, 'player');
        this.physics.p2.enable(player, false);
        player.frame = 1;
        player.body.clearShapes();
        player.body.loadPolygon('sprite_physics', 'player');
        player.anchor.setTo(0.5, 0.5);
        player.body.fixedRotation = true;
        player.body.damping = 0.5;

        player.animations.add('idle', [10, 11, 12, 13, 14, 15, 16, 17], 10, true);
        player.animations.add('jump', [20, 21, 22, 23, 24, 25, 26, 27, 28], 10, true);
        player.animations.add('shoot', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
        player.animations.add('run', [38, 39, 40, 41, 42, 43, 44, 45], 10, true);
        player.animations.add('die', [1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        this.physics.p2.enable(player);
        this.camera.follow(player);
        player.body.collideWorldBounds = true;
    },
    createSphere: function () {
        enemy1 = new EnemySphere('sphere', this.game, 810, 90, 'sphere', 28);
        enemy1.sphere.body.moveLeft(400);
        var spriteMaterial = this.game.physics.p2.createMaterial('sphere', enemy1.sphere.body);
        worldMaterial = this.game.physics.p2.createMaterial('Collisions', map2.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial = this.game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);
        contactMaterial.restitution = 1.0;
    },
    createMiniSphere: function (x, y) {
        enemyMini1 = new EnemySphere('miniSphere1', this.game, x, y, 'miniSphere', 10);
        enemyMini1.sphere.body.moveRight(500);
        enemyMini1.sphere.body.moveUp(400);
        var spriteMaterial2 = this.game.physics.p2.createMaterial('miniSphere', enemyMini1.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial2 = this.game.physics.p2.createContactMaterial(spriteMaterial2, worldMaterial);
        contactMaterial2.restitution = 1;

        enemyMini2 = new EnemySphere('miniSphere2', this.game, x, y - 50, 'miniSphere', 10);
        enemyMini2.sphere.body.moveLeft(550);
        enemyMini2.sphere.body.moveUp(450);
        var spriteMaterial3 = this.game.physics.p2.createMaterial('miniSphere', enemyMini2.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial3 = this.game.physics.p2.createContactMaterial(spriteMaterial3, worldMaterial);
        contactMaterial3.restitution = 1;
    },
    createBomb: function (x, y) {
        bomb = new EnemyBomb('bomb', this.game, x, y, 'bomb');
        bomb.weapon.animations.add('turn', [1, 2, 3, 4, 5], 10, true);
        explosion = this.game.add.sprite(bomb.weapon.position.x - 70, 520, 'boom');
        explosion.animations.add('boom', [
            11,12,13,14,15,16,17,18,19,20,
            21,22,23,24,25,26,27,28,29,30,
            31,32,33,34,35,36,37,38,39,40,
            41,42,43,44,45,46,47,48,49,50,
            51,52,53,54,55,56,57,58,59,60,
            61,62,63,64], 60, false);
        // this.physics.p2.enable(bomb, true);
    },
    createBullets: function () {
        //Bullets
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.P2JS;
        this.bullets.createMultiple(10, 'bullet', 0, false);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('scale.x', 0.5);
        this.bullets.setAll('scale.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        // this.bullets.events.onOutOfBounds.add(this.bulletKill, this);

    },
    fireBullet: function () {
        if (!player.alive || this.time.now < shootTime) {
            return;
        }
        if (shootTime < this.time.now) {
            shootTime = this.time.now + 900;
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet) {
                this.bullet.reset(player.x, player.y - 40);
                // this.bullet.body.velocity.y = -500;
                this.bullet.body.velocity.y = -1200;
                // this.bullet.body.moveUp(1200);

            }
            this.bullet.body.createBodyCallback(enemy1.sphere, this.hitEnemy, this);
            if (enemyMini1 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini1.sphere, this.hitEnemyMini, this);
            if (enemyMini2 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini2.sphere, this.hitEnemyMini, this);
            if(bomb !== undefined)
                this.bullet.body.createBodyCallback(bomb.weapon, this.hitEnemyMini, this);
        }
    },
    hitEnemy: function (body1, body2) {
        this.createMiniSphere(body2.x, body2.y);
        body2.sprite.kill();
        body1.sprite.kill();
        Score += 50;
    },
    hitEnemyMini: function (body1, body2) {
        body2.sprite.kill();
        body1.sprite.kill();
        Score += 50;
    },
    hitPlayer: function (body1, body2) {
        body2.sprite.kill();
        liveCounter--;
        if (liveCounter !== 0)
            this.state.restart();
        // body2.sprite.reset(initPlayer.x, initPlayer.y);
        var sprite = lives.getFirstExists(true);
        if (sprite) {
            sprite.kill();
        }
    },
    liveIndicator: function () {
        lives = this.add.group();
        var s = 0;
        for (var i = 0; i < liveCounter; i++) {
            var live = lives.create(livePosition + s, 85, 'live');
            s += 35;
        }
    },
    render: function () {
    }
};

function randomLocation() {
    return Math.floor((Math.random() * 750) + 80);
}

function checkIfCanJump(game) {
    var result = false;
    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];
        if (c.bodyA === player.body.data || c.bodyB === player.body.data) {
            var d = p2.vec2.dot(c.normalA, yAxis);
            if (c.bodyA === player.body.data)
                d *= -1;
            if (d > 0.5)
                result = true;
        }
    }
    return result;
}