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
Game.Level4 = function () {
};
//#region - variables
var map4;
var enemyMiniExtra, enemyMiniExtra2;
var liveCounter = 5;
var shootTime = 0;
var bool = true;
var gotMGun = false;
var newMGunPwr = 300;
var timer, timerEvent, text;
//#endregion
Game.Level4.prototype = {
    create: function () {
        var game = this;
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = 400;
        this.stage.backgroundColor = '#000';
        map4 = this.add.tilemap('map4');
        map4.addTilesetImage('tileset');
        customBounds = {left: null, right: null, top: null, bottom: null};
        layer = map4.createLayer('field');
        layer.resizeWorld();
        game.physics.p2.convertTilemap(map4, layer);

        Game.Level1.prototype.createPlayer(game);
        Game.Level1.prototype.createSphere(game, map4);
        Game.Level1.prototype.createBullets(game);
        this.createMiniSphere2(128, 200);
        // sndMusic = game.add.audio('background');
        // sndMusic.play();
        sndShoot = this.add.audio('shoot');
        sndJump = this.add.audio('jump');
        sndHit = this.add.audio('hit');
        sndBounce = this.add.audio('bounce');
        sndPickUp = this.add.audio('pickup');
        sndPickUpLive = this.add.audio('pickuplive');
        sndExplosion = this.add.audio('explosion');

        // Create a custom timer
        timer = game.time.create();
        // Create a delayed event 5s from now
        timerEvent = timer.add(Phaser.Timer.SECOND * 5, this.endTimer, this);

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
        bounces = 0;
        bombLoop = game.time.events.loop(Phaser.Timer.SECOND * 4, function () {
            let rndX = randomLocation();
            Game.Level2.prototype.createBomb(game, rndX);
        }, this);
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
            if (Math.floor(bomb.weapon.position.y) > 530 && bomb.weapon.alive) {
                sndExplosion.play();
                explosion.animations.play('boom');
                bomb.weapon.destroy();
            }
            if (bomb.weapon.body !== null && player.alive)
                if (bomb.weapon.alive)
                    bomb.weapon.body.createBodyCallback(player, this.hitPlayer, this);
        }

        if (liveCounter > 0 && player.alive) {
            if (Math.floor(enemy1.sphere.position.y) > 540) {
                bounces++;
                sndBounce.play();
            }
            if (bounces > 8)
                this.hitPlayer(enemy1.sphere, player.body);
            if (Math.floor(enemyMiniExtra.sphere.position.y) > 540 ||
                Math.floor(enemyMiniExtra2.sphere.position.y) > 540)
                sndBounce.play();
            if (enemyMini1 !== undefined)
                if (Math.floor(enemyMini1.sphere.position.y) > 540 ||
                    Math.floor(enemyMini2.sphere.position.y) > 540)
                    sndBounce.play();
            if (enemyMicro1 !== undefined)
                if (Math.floor(enemyMicro1.sphere.position.y) > 540 ||
                    Math.floor(enemyMicro2.sphere.position.y) > 540)
                    sndBounce.play();
            if (enemyMicro3 !== undefined)
                if (Math.floor(enemyMicro3.sphere.position.y) > 540 ||
                    Math.floor(enemyMicro4.sphere.position.y) > 540)
                    sndBounce.play();

            enemy1.sphere.body.createBodyCallback(player, this.hitPlayer, this);
            enemyMiniExtra.sphere.body.createBodyCallback(player, this.hitPlayer, this);
            enemyMiniExtra2.sphere.body.createBodyCallback(player, this.hitPlayer, this);
            if (enemyMini1 !== null && enemyMini1 !== undefined)
                if (enemyMini1.sphere.body !== null && enemyMini1.sphere.body !== undefined) {
                    enemyMini1.sphere.body.createBodyCallback(player, this.hitPlayer, this);
                    enemyMini2.sphere.body.createBodyCallback(player, this.hitPlayer, this);
                }
            if (enemyMicro1 !== null && enemyMicro1 !== undefined)
                if (enemyMicro1.sphere.body !== null && enemyMicro1.sphere.body !== undefined) {
                    enemyMicro1.sphere.body.createBodyCallback(player, this.hitPlayer, this);
                    enemyMicro2.sphere.body.createBodyCallback(player, this.hitPlayer, this);
                }
            if (enemyMicro3 !== null && enemyMicro3 !== undefined)
                if (enemyMicro3.sphere.body !== null && enemyMicro3.sphere.body !== undefined) {
                    enemyMicro3.sphere.body.createBodyCallback(player, this.hitPlayer, this);
                    enemyMicro4.sphere.body.createBodyCallback(player, this.hitPlayer, this);
                }

            // Fin del juego
            if (!enemy1.sphere.alive)
                if (!enemyMini1.sphere.alive && !enemyMini2.sphere.alive)
                    if (!enemyMicro1.sphere.alive &&
                        !enemyMicro2.sphere.alive)
                        if (!enemyMicro3.sphere.alive &&
                            !enemyMicro4.sphere.alive) {
                            player.animations.play('shoot');
                            this.add.text(380, 264, 'Enhorabuena!!! Has Completado el juego.', {
                                fontSize: '32px',
                                fill: '#fff'
                            });
                            this.add.text(380, 294, 'Score: ' + score, {fontSize: '32px', fill: '#fff'});
                            this.add.text(380, 324, 'Bonus vida: x' + liveCounter + ' ' + score * liveCounter, {
                                fontSize: '32px',
                                fill: '#fff'
                            });
                            game.time.events.remove(bombLoop);
                            this.game.time.events.add(2000, function () {
                                score = score * liveCounter;
                                saveScore(score, 4);
                                game.state.start('ScoreBoard');
                            });
                        }

            this.bullets.forEach(function (e) {
                if (e.position.y < 85 || e.position.y > 535)
                    e.kill();
            }, this);

            // Drop elements
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
            saveScore(score, 4);
            this.game.time.events.add(3000, function () {
                saveScore(score, 4);
                resetGame();
                game.state.start('ScoreBoard');
            });
        }
    },
    createMiniSphere: function (x, y) {
        enemyMini1 = new EnemySphere('miniSphere1', this.game, x, y, 'miniSphereCyan', 10);
        enemyMini1.sphere.body.moveRight(500);
        enemyMini1.sphere.body.moveUp(400);
        var spriteMaterial2 = this.game.physics.p2.createMaterial('miniSphereCyan', enemyMini1.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial2 = this.game.physics.p2.createContactMaterial(spriteMaterial2, worldMaterial);
        contactMaterial2.restitution = 1;

        enemyMini2 = new EnemySphere('miniSphere2', this.game, x, y - 50, 'miniSphereCyan', 10);
        enemyMini2.sphere.body.moveLeft(550);
        enemyMini2.sphere.body.moveUp(450);
        var spriteMaterial3 = this.game.physics.p2.createMaterial('miniSphereCyan', enemyMini2.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial3 = this.game.physics.p2.createContactMaterial(spriteMaterial3, worldMaterial);
        contactMaterial3.restitution = 1;
    },
    createMiniSphere2: function (x, y) {
        enemyMiniExtra = new EnemySphere('miniSphere1', this.game, x, y - 64, 'miniSphereGreen', 10);
        enemyMiniExtra.sphere.body.moveRight(500);
        var spriteMaterialMiniExtra = this.game.physics.p2.createMaterial('miniSphereGreen', enemyMiniExtra.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterialMiniExtra = this.game.physics.p2.createContactMaterial(spriteMaterialMiniExtra, worldMaterial);
        contactMaterialMiniExtra.restitution = 1;

        enemyMiniExtra2 = new EnemySphere('miniSphere2', this.game, x + 64, y, 'miniSphereGreen', 10);
        enemyMiniExtra2.sphere.body.moveRight(550);
        var spriteMaterialExtra2 = this.game.physics.p2.createMaterial('miniSphereGreen', enemyMiniExtra2.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterialExtra2 = this.game.physics.p2.createContactMaterial(spriteMaterialExtra2, worldMaterial);
        contactMaterialExtra2.restitution = 1;
    },
    createMicroSphere1: function (x, y) {
        enemyMicro1 = new EnemySphere('microSphere1', this.game, x, y, 'microSphere2', 10);
        enemyMicro1.sphere.body.moveRight(500);
        enemyMicro1.sphere.body.moveUp(400);
        var spriteMaterial4 = this.game.physics.p2.createMaterial('microSphere2', enemyMicro1.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial4 = this.game.physics.p2.createContactMaterial(spriteMaterial4, worldMaterial);
        contactMaterial4.restitution = 1;

        enemyMicro2 = new EnemySphere('microSphere2', this.game, x, y - 50, 'microSphere2', 10);
        enemyMicro2.sphere.body.moveLeft(550);
        enemyMicro2.sphere.body.moveUp(450);
        var spriteMaterial5 = this.game.physics.p2.createMaterial('microSphere2', enemyMicro2.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial5 = this.game.physics.p2.createContactMaterial(spriteMaterial5, worldMaterial);
        contactMaterial5.restitution = 1;
    },
    createMicroSphere2: function (x, y) {
        enemyMicro3 = new EnemySphere('microSphere1', this.game, x, y, 'microSphere2', 10);
        enemyMicro3.sphere.body.moveRight(500);
        enemyMicro3.sphere.body.moveUp(400);
        var spriteMaterial6 = this.game.physics.p2.createMaterial('microSphere2', enemyMicro3.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial6 = this.game.physics.p2.createContactMaterial(spriteMaterial6, worldMaterial);
        contactMaterial6.restitution = 1;

        enemyMicro4 = new EnemySphere('microSphere2', this.game, x, y - 50, 'microSphere2', 10);
        enemyMicro4.sphere.body.moveLeft(550);
        enemyMicro4.sphere.body.moveUp(450);
        var spriteMaterial7 = this.game.physics.p2.createMaterial('microSphere2', enemyMicro4.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial7 = this.game.physics.p2.createContactMaterial(spriteMaterial7, worldMaterial);
        contactMaterial7.restitution = 1;
    },
    fireBullet: function () {
        if (gotMGun)
            newMGunPwr = 150;
        else
            newMGunPwr = 300;
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
            this.bullet.body.createBodyCallback(enemyMiniExtra.sphere, this.hitEnemyMini, this);
            this.bullet.body.createBodyCallback(enemyMiniExtra2.sphere, this.hitEnemyMini, this);
            if (enemyMini1 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini1.sphere, this.hitEnemyMini, this);
            if (enemyMini2 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini2.sphere, this.hitEnemyMini, this);
            if (enemyMicro1 !== undefined)
                this.bullet.body.createBodyCallback(enemyMicro2.sphere, this.hitEnemyMicro, this);
            if (enemyMicro2 !== undefined)
                this.bullet.body.createBodyCallback(enemyMicro1.sphere, this.hitEnemyMicro, this);
            if (enemyMicro3 !== undefined)
                this.bullet.body.createBodyCallback(enemyMicro3.sphere, this.hitEnemyMicro, this);
            if (enemyMicro4 !== undefined)
                this.bullet.body.createBodyCallback(enemyMicro4.sphere, this.hitEnemyMicro, this);
            if (bomb !== undefined)
                this.bullet.body.createBodyCallback(bomb.weapon, this.hitEnemyMicro, this);
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
            case 9:
            case 10:
                this.createNewGun(this);
                this.mGun = this.mGun.getFirstExists(false);
                this.mGun.reset(body2.x, body2.y + 35);
                this.time.events.add(Phaser.Timer.SECOND * 3, this.loseDrop, this);
                break;
            default:
                break;
        }
    },
    hitEnemyMini: function (body1, body2) {
        if (bool) {
            this.createMicroSphere1(body2.x, body2.y);
            bool = false;
        } else {
            this.createMicroSphere2(body2.x, body2.y);
            bool = true;
        }
        body2.sprite.kill();
        body1.sprite.kill();
        score += 75;
    },
    hitEnemyMicro: function (body1, body2) {
        body2.sprite.kill();
        body1.sprite.kill();
        score += 100;
    },
    hitPlayer: function (body1, body2) {
        sndHit.play();
        if (body2.sprite.alive)
            liveCounter--;
        body2.sprite.kill();
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
        if (this.mGun !== null && this.mGun !== undefined)
            if (this.mGun.alive) {
                sndPickUp.play();
                body2.sprite.kill();
                gotMGun = true;
                timer.start();
                this.time.events.add(Phaser.Timer.SECOND * 5, function () {
                    gotMGun = false;
                }, this);
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
    },
    render: function () {
        if (timer.running) {
            this.game.debug.text('Tiempo del arma',this.game.world.centerX - 75, 40, "#ff0");
            this.game.debug.text(this.formatTime(
                Math.round((timerEvent.delay - timer.ms) / 1000)),
                this.game.world.centerX - 25, 65, "#ff0");
        }
    },
    endTimer: function() {
        // Stop the timer when the delayed event triggers
        timer.stop();
    },
    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);
    }
};