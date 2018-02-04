EnemySphere = function (index, game, x, y, type, radius) {
    this.sphere = game.add.sprite(x, y, type);
    this.sphere.anchor.setTo(0.5, 0.5);
    this.sphere.name = index.toString();

    game.physics.p2.enable(this.sphere);
    this.sphere.body.collideWorldBounds = true;
    this.sphere.body.setCircle(radius);
    game.physics.p2.setBounds(64, 64, 880, 505, true, true, true, true);
};
EnemyBomb = function (index, game, x, y, type) {
    this.weapon = game.add.sprite(x, y, type);
    this.weapon.anchor.setTo(0.5, 0.5);
    this.weapon.name = index.toString();

    game.physics.p2.enable(this.weapon);
    this.weapon.body.collideWorldBounds = true;
    game.physics.p2.setBounds(64, 64, 880, 505, true, true, true, true);
};
DropElement = function (index, game, x, y, type, radius) {
    this.drop = game.add.sprite(x, y, type);
    this.drop.anchor.setTo(0.5, 0.5);
    this.drop.name = index.toString();

    game.physics.p2.enable(this.drop);
    this.drop.body.collideWorldBounds = true;
    this.drop.body.setCircle(radius);
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
var customBounds;
var scoreText;
var bonusText;
var endLevelText;
var avatar;
var lives;
var bounces;
var bombLoop;
// //Sound variables
// var sndMusic;
// var sndShoot;
// var sndJump;
// var sndBounce;
// var sndPickUp;
// var sndPickUpLive;
// var sndExplosion;

//#endregion
Game.Level2.prototype = {
    create: function () {
        var game = this;
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = 500;
        this.stage.backgroundColor = '#000';
        map2 = this.add.tilemap('map2');
        map2.addTilesetImage('tileset');
        customBounds = {left: null, right: null, top: null, bottom: null};

        sndShoot = this.add.audio('shoot');
        sndJump = this.add.audio('jump');
        sndHit = this.add.audio('hit');
        sndBounce = this.add.audio('bounce');
        sndPickUp = this.add.audio('pickup');
        sndPickUpLive = this.add.audio('pickuplive');
        sndExplosion = this.add.audio('explosion');

        layer = map2.createLayer('field');
        layer.resizeWorld();
        Game.Level1.prototype.createPlayer(game);
        Game.Level1.prototype.createSphere(game, map2);
        Game.Level1.prototype.createBullets(game);
        game.physics.p2.convertTilemap(map2, layer);

        controls = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            up: this.input.keyboard.addKey(Phaser.Keyboard.W),
            shoot: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        };
        scoreText = game.add.text(780, 50, 'Score: 0', {fontSize: '22px', fill: '#fff'});
        avatar = game.add.sprite(700, 50, 'avatar');
        avatar.width = 64;
        avatar.height = 64;
        bombLoop = game.time.events.loop(Phaser.Timer.SECOND * 3, function () {
            let rndX = randomLocation();
            game.createBomb(game, rndX);
        }, this);

        bounces = 0;
        this.liveIndicator();
        createRoundButton(game, "", 32, 85, 40, 40,
            function () {
                resetGame();
                game.state.start('Preloader');
            }, 4);
        createRoundButton(game, "", 85, 85, 40, 40, muteMusic, 1);
    },
    update: function () {
        var game = this;
        scoreText.text = 'Score: ' + score;
        if (bomb !== undefined && bomb !== null) {
            bomb.weapon.animations.play('turn');
            if (Math.floor(bomb.weapon.position.y) > 540 && bomb.weapon.alive) {
                sndExplosion.play();
                explosion.animations.play('boom');
                bomb.weapon.kill();
            }
            if (bomb.weapon.body !== null && player.alive)
                if (bomb.weapon.alive)
                    bomb.weapon.body.createBodyCallback(player, this.hitPlayer, this);
        }

        if (liveCounter > 0 && player.alive) {
            if (Math.floor(enemy1.sphere.position.y) > 530) {
                bounces++;
                sndBounce.play();
            }
            if (bounces > 8)
                this.hitPlayer(enemy1.sphere, player.body);
            if (enemyMini1 !== undefined)
                if (Math.floor(enemyMini1.sphere.position.y) > 540 ||
                    Math.floor(enemyMini2.sphere.position.y) > 540)
                    sndBounce.play();


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
                    endLevelText = this.add.text(380, 264, 'Fin del nivel 2', {fontSize: '32px', fill: '#fff'});
                    scoreText = this.add.text(380, 294, 'Score: ' + score, {fontSize: '32px', fill: '#fff'});
                    bonusText = this.add.text(380, 324, 'Bonus vida: x' + liveCounter + ' ' + score * liveCounter, {
                        fontSize: '32px',
                        fill: '#fff'
                    });
                    game.time.events.remove(bombLoop);
                    this.game.time.events.add(1000, function () {
                        game.add.text(380, 360, 'Cargando siguiente nivel...', {
                            fontSize: '25px',
                            fill: '#fff'
                        });
                    });
                    this.game.time.events.add(3000, function () {
                        score = score * liveCounter;
                        saveScore(score, 2);
                        game.state.start('Level3');
                    });
                }

            this.bullets.forEach(function (e) {
                if (e.position.y < 85 || e.position.y > 535)
                    e.kill();
            }, this);

            if (enemyMini1 !== undefined && enemyMini1 !== null) {
                if (this.powerUp !== null && this.powerUp !== undefined)
                    if (this.powerUp.alive) {
                        enemyMini1.sphere.body.createBodyCallback(this.powerUp, this.loseDrop, this);
                        enemyMini2.sphere.body.createBodyCallback(this.powerUp, this.loseDrop, this);
                        if (bomb !== undefined && bomb.weapon.body !== null)
                            bomb.weapon.body.createBodyCallback(this.powerUp, this.loseDrop, this);
                        player.body.createBodyCallback(this.powerUp, this.catchDrop, this);
                    }
                if (this.barrel !== null && this.barrel !== undefined)
                    if (this.barrel.alive) {
                        enemyMini1.sphere.body.createBodyCallback(this.barrel, this.loseDrop, this);
                        enemyMini2.sphere.body.createBodyCallback(this.barrel, this.loseDrop, this);
                        if (bomb !== undefined && bomb.weapon.body !== null)
                            bomb.weapon.body.createBodyCallback(this.barrel, this.loseDrop, this);
                        player.body.createBodyCallback(this.barrel, this.catchDrop, this);
                    }
                if (this.live !== null && this.live !== undefined)
                    if (this.live.alive) {
                        enemyMini1.sphere.body.createBodyCallback(this.live, this.loseDrop, this);
                        enemyMini2.sphere.body.createBodyCallback(this.live, this.loseDrop, this);
                        if (bomb !== undefined && bomb.weapon.body !== null)
                            bomb.weapon.body.createBodyCallback(this.live, this.loseDrop, this);
                        player.body.createBodyCallback(this.live, this.catchDrop, this);
                    }
            }
            //#region - Player controls
            if (Math.round(player.body.velocity.x) === 0 &&
                Math.round(player.body.velocity.y) === 0)
                player.animations.play('idle');
            if (controls.right.isDown) {
                player.animations.play('run');
                player.scale.setTo(1, 1);
                player.body.moveRight(250);
            }
            if (controls.left.isDown) {
                player.animations.play('run');
                player.scale.setTo(-1, 1);
                player.body.moveLeft(250);
            }
            if (controls.shoot.isDown && player.alive) {
                sndShoot.play();
                this.fireBullet();
                player.frame = 34;
            }

            if (controls.up.isDown && this.time.now > jumpTimer && checkIfCanJump(this)) {
                player.body.moveUp(350);
                sndJump.play();
                player.animations.play('jump');
                jumpTimer = this.time.now + 750;
            }
            //#endregion
        } else {
            game.time.events.remove(bombLoop);
            this.add.text(380, 264, 'Fin del juego', {fontSize: '32px', fill: '#fff'});
            saveScore(score, 2);
            this.game.time.events.add(3000, function () {
                saveScore(score, 2);
                resetGame();
                game.state.start('ScoreBoard');
            });
        }
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
    createBomb: function (game, x, y) {
        bomb = new EnemyBomb('bomb', game, x, y, 'bomb');
        bomb.weapon.animations.add('turn', [1, 2, 3, 4, 5], 10, true);
        explosion = game.add.sprite(bomb.weapon.position.x - 70, 520, 'boom');
        explosion.animations.add('boom', [
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
            51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
            61, 62, 63, 64], 60, false);
    },
    fireBullet: function () {
        if (!player.alive || this.time.now < shootTime)
            return;
        if (shootTime < this.time.now) {
            shootTime = this.time.now + 300;
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet) {
                this.bullet.reset(player.x, player.y - 40);
                this.bullet.body.velocity.y = -1200;
            }
            this.bullet.body.createBodyCallback(enemy1.sphere, this.hitEnemy, this);
            if (enemyMini1 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini1.sphere, this.hitEnemyMini, this);
            if (enemyMini2 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini2.sphere, this.hitEnemyMini, this);
            if (bomb !== undefined)
                this.bullet.body.createBodyCallback(bomb.weapon, this.hitEnemyMini, this);
            if (this.barrel !== undefined)
                this.bullet.body.createBodyCallback(this.barrel, this.hitEnemyMini, this);
        }
    },
    hitEnemy: function (body1, body2) {
        this.createMiniSphere(body2.x, body2.y);
        body2.sprite.kill();
        body1.sprite.kill();
        score += 50;
        let rndDrop = randomDrop();
        switch (rndDrop) {
            case 1:
            case 2:
            case 3:
                this.createPowerUp(this);
                this.powerUp = this.powerUp.getFirstExists(false);
                this.powerUp.reset(body2.x, body2.y + 35);
                this.time.events.add(Phaser.Timer.SECOND * 3, this.loseDrop, this);
                break;
            case 4:
            case 5:
            case 6:
                this.createBarrel(this);
                this.barrel = this.barrel.getFirstExists(false);
                this.barrel.reset(body2.x, body2.y + 35);
                this.time.events.add(Phaser.Timer.SECOND * 3, this.loseDrop, this);
                break;
            case 7:
            case 8:
                this.dropLive(this);
                this.live = this.live.getFirstExists(false);
                this.live.reset(body2.x, body2.y + 35);
                this.time.events.add(Phaser.Timer.SECOND * 3, this.loseDrop, this);
                break;
            default:
                break;
        }
    },
    hitEnemyMini: function (body1, body2) {
        body2.sprite.kill();
        body1.sprite.kill();
        score += 75;
    },
    hitPlayer: function (body1, body2) {
        sndHit.play();
        if (body2.sprite.alive)
            liveCounter--;
        body2.sprite.kill();
        score -= 50;
        if (score < 0)
            score = 0;
        if (liveCounter !== 0)
            this.state.restart();
        var sprite = lives.getFirstExists(true);
        if (sprite)
            sprite.kill();
        if (enemyMini1 !== undefined)
            player.body.createBodyCallback(enemyMini1.sphere, this.hitEnemyMini, this);
        if (enemyMini2 !== undefined)
            player.body.createBodyCallback(enemyMini2.sphere, this.hitEnemyMini, this);
        if (bomb !== undefined)
            player.body.createBodyCallback(bomb.weapon, this.hitEnemyMini, this);

    },
    createPowerUp: function (game) {
        game.powerUp = game.add.group();
        game.powerUp.enableBody = true;
        game.powerUp.physicsBodyType = Phaser.Physics.P2JS;
        game.powerUp.createMultiple(1, 'powerUp', 0, false);
        game.powerUp.setAll('anchor.x', 0.5);
        game.powerUp.setAll('anchor.y', 0.5);
        game.powerUp.setAll('outOfBoundsKill', true);
        game.powerUp.setAll('checkWorldBounds', true);
    },
    createBarrel: function (game) {
        game.barrel = game.add.group();
        game.barrel.enableBody = true;
        game.barrel.physicsBodyType = Phaser.Physics.P2JS;
        game.barrel.createMultiple(1, 'barrel', 0, false);
        game.barrel.setAll('anchor.x', 0.5);
        game.barrel.setAll('anchor.y', 0.5);
        game.barrel.setAll('outOfBoundsKill', true);
        game.barrel.setAll('checkWorldBounds', true);
    },
    dropLive: function (game) {
        game.live = game.add.group();
        game.live.enableBody = true;
        game.live.physicsBodyType = Phaser.Physics.P2JS;
        game.live.createMultiple(1, 'live', 0, false);
        game.live.setAll('anchor.x', 0.5);
        game.live.setAll('anchor.y', 0.5);
        game.live.setAll('outOfBoundsKill', true);
        game.live.setAll('checkWorldBounds', true);
    },
    catchDrop: function (body1, body2) {
        if (this.powerUp !== null && this.powerUp !== undefined)
            if (this.powerUp.alive) {
                sndPickUp.play();
                body2.sprite.kill();
                score += 150;
            }
        if (this.live !== null && this.live !== undefined)
            if (this.live.alive) {
                sndPickUpLive.play();
                body2.sprite.kill();
                if (liveCounter < 5) {
                    liveCounter += 1;
                    this.liveIndicator();
                }
            }
        if (this.barrel !== null && this.barrel !== undefined)
            if (this.barrel.alive) {
                sndExplosion.play();
                body2.sprite.kill();
                score -= 50;
                if (score < 0)
                    score = 0;
            }

    },
    loseDrop: function () {
        if (this.powerUp !== null && this.powerUp !== undefined)
            if (this.powerUp.alive)
                this.powerUp.kill();
        if (this.barrel !== null && this.barrel !== undefined)
            if (this.barrel.alive)
                this.barrel.kill();
        if (this.live !== null && this.live !== undefined)
            if (this.live.alive)
                this.live.kill();
    },
    liveIndicator: function () {
        lives = this.add.group();
        var s = 0;
        for (var i = 0; i < liveCounter; i++) {
            lives.create(livePosition + s, 85, 'live');
            s += 35;
        }
    }
};

function randomLocation() {
    return Math.floor((Math.random() * 750) + 80);
}

function randomDrop() {
    return Math.floor((Math.random() * 12) + 1);
}