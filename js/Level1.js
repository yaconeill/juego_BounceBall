EnemySphere = function (index, game, x, y, type, radius) {
    game.sphere = game.add.sprite(x, y, type);
    game.sphere.anchor.setTo(0.5, 0.5);
    game.sphere.name = index.toString();

    game.physics.p2.enable(game.sphere);
    game.sphere.body.collideWorldBounds = true;
    game.sphere.body.setCircle(radius);
    game.physics.p2.setBounds(64, 64, 880, 505, true, true, true, true);
};
Game.Level1 = function (game) {
};
//#region - variables
var map;
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
var facing = 'left';
var customBounds;
var score = 0;
var scoreText;
var avatar;
var lives;
const livePosition = 780;
var initPlayer = {
    x: 400,
    y: 500
};
var w = 960, h = 600;
var yAxis = p2.vec2.fromValues(0, 1);

var playerLevel = 0;

//Sound variables
var sndShoot;
var sndJump;
var sndHit;
var sndBounce;
var sndPickUp;
var sndPickUpLive;
var sndExplosion;

//#endregion
Game.Level1.prototype = {
    create: function () {
        var game = this;
        if (enemyMini1 !== undefined && enemyMini2 !== undefined) {
            enemyMini1.sphere.destroy();
            enemyMini2.sphere.destroy();
        }
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = 500;
        this.stage.backgroundColor = '#000';
        map = this.add.tilemap('map');
        map.addTilesetImage('tileset');
        sndShoot = this.add.audio('shoot');
        sndBounce = this.add.audio('bounce');
        customBounds = {left: null, right: null, top: null, bottom: null};
        layer = map.createLayer('field');
        layer.resizeWorld();
        this.createPlayer(game);
        this.createSphere(game, map);
        this.createBullets(game);
        game.physics.p2.convertTilemap(map, layer);

        sndShoot = this.add.audio('shoot');
        sndJump = this.add.audio('jump');
        sndHit = this.add.audio('hit');
        sndBounce = this.add.audio('bounce');
        sndPickUp = this.add.audio('pickup');
        sndPickUpLive = this.add.audio('pickuplive');
        sndExplosion = this.add.audio('explosion');

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

        this.liveIndicator();
        createRoundButton(game, "", 32, 85, 40, 40,
            function () {
                resetGame();
                game.state.start('Preloader');
            },4);
        createRoundButton(game, "", 85, 85, 40, 40,muteMusic,1);
    },
    update: function () {
        var game = this;
        scoreText.text = 'Score: ' + score;

        if (liveCounter !== 0 && player.alive) {
            if (Math.floor(enemy1.sphere.position.y) > 540) {
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
                    this.add.text(380, 264, 'Fin del nivel 1', {fontSize: '32px', fill: '#fff'});
                    this.add.text(380, 294, 'Score: ' + score, {fontSize: '32px', fill: '#fff'});
                    this.add.text(380, 324, 'Bonus vida: x' + liveCounter + ' ' + score * liveCounter, {
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
                        score = score * liveCounter;
                        saveScore(score, 1);
                        game.state.start('Level2');
                    });
                }

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
                player.animations.play('jump');
                jumpTimer = this.time.now + 750;
            }
        } else {
            player.animations.play('die');
            this.add.text(380, 264, 'Fin del juego', {fontSize: '32px', fill: '#fff'});
            saveScore(score, 1);
            this.game.time.events.add(3000, function () {
                saveScore(score, 1);
                resetGame();
                game.state.start('ScoreBoard');
            });
        }
    },
    createPlayer: function (game) {
        player = game.add.sprite(initPlayer.x, initPlayer.y, 'player');
        game.physics.p2.enable(player, false);
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
        player.animations.add('die', [1, 2, 3, 4, 5, 6, 7, 8, 9], 10, false);
        game.physics.p2.enable(player);
        game.camera.follow(player);
        player.body.collideWorldBounds = true;
    },
    createSphere: function (game, map) {
        enemy1 = new EnemySphere('sphere', game, 810, 90, 'sphere', 28);
        enemy1.sphere.body.moveLeft(400);
        var spriteMaterial = game.physics.p2.createMaterial('sphere', enemy1.sphere.body);
        worldMaterial = game.physics.p2.createMaterial('Collisions', map.body);
        game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);
        contactMaterial.restitution = 1.0;
    },
    createMiniSphere: function (x, y) {
        enemyMini1 = new EnemySphere('miniSphere', this.game, x, y, 'miniSphere', 10);
        enemyMini1.sphere.body.moveRight(500);
        enemyMini1.sphere.body.moveUp(400);
        var spriteMaterial2 = this.game.physics.p2.createMaterial('miniSphere', enemyMini1.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial2 = this.game.physics.p2.createContactMaterial(spriteMaterial2, worldMaterial);
        contactMaterial2.restitution = 1;

        enemyMini2 = new EnemySphere('miniSphere', this.game, x, y - 50, 'miniSphere', 10);
        enemyMini2.sphere.body.moveLeft(550);
        enemyMini2.sphere.body.moveUp(450);
        var spriteMaterial3 = this.game.physics.p2.createMaterial('miniSphere', enemyMini2.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial3 = this.game.physics.p2.createContactMaterial(spriteMaterial3, worldMaterial);
        contactMaterial3.restitution = 1;
    },
    createBullets: function (game) {
        game.bullets = game.add.group();
        game.bullets.enableBody = true;
        game.bullets.physicsBodyType = Phaser.Physics.P2JS;
        game.bullets.createMultiple(10, 'bullet', 0, false);
        game.bullets.setAll('anchor.x', 0.5);
        game.bullets.setAll('anchor.y', 0.5);
        game.bullets.setAll('scale.x', 0.5);
        game.bullets.setAll('scale.y', 0.5);
        game.bullets.setAll('outOfBoundsKill', true);
        game.bullets.setAll('checkWorldBounds', true);

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
                this.bullet.body.createBodyCallback(enemyMini1.sphere, this.hitEnemy, this);
            if (enemyMini2 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini2.sphere, this.hitEnemy, this);
        }
    },
    hitEnemy: function (body1, body2) {
        if (enemy1.sphere.alive)
            this.createMiniSphere(body2.x, body2.y);
        body2.sprite.kill();
        body1.sprite.kill();
        score += 50;
    },
    hitPlayer: function (body1, body2) {
        sndHit.play();
        body2.sprite.kill();
        liveCounter--;
        if (liveCounter !== 0)
            this.state.restart();
        var sprite = lives.getFirstExists(true);
        if (sprite)
            sprite.kill();
    },
    liveIndicator: function () {
        lives = this.add.group();
        var s = 0;
        for (var i = 0; i < liveCounter; i++) {
            var live = lives.create(livePosition + s, 85, 'live');
            s += 35;
        }
    }
};
function resetGame() {
    liveCounter = 5;
    score = 0;
    sndMusic.stop();
    player.alive = true;
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
function saveScore(score,level) {
    allUsers.find(e =>{
        if(e.userName === currentUser){
            if (score > e.score){
                e.score = score;
                e.level = level;
            }
        }
    });
    localStorage.setItem('users', JSON.stringify(allUsers));
}
