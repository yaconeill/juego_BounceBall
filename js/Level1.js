EnemySphere = function (index, game, x, y, type, radius) {
    this.sphere = game.add.sprite(x, y, type);
    this.sphere.anchor.setTo(0.5, 0.5);
    this.sphere.name = index.toString();

    game.physics.enable(this.sphere, Phaser.Physics.P2JS);
    this.sphere.body.collideWorldBounds = true;
    this.sphere.body.setCircle(radius);
    game.physics.p2.setBounds(64, 64, 880, 505, true, true, true, true);

    // this.birdTween = game.add.tween(this.bird).to({
    //     y: this.bird.y + 200
    // }, 2000, 'Linear', true, 0, 100, true);
};
Bullet = function (game) {
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.P2JS;
    this.bullets.createMultiple(1, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('scale.x', 0.5);
    this.bullets.setAll('scale.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
};
Game.Level1 = function (game) {
};
//#region - variables
var map;
var layer;
var enemy1;
var enemyMini1;
var enemyMini2;
var player;
var controls = {};
var playerSpeed = 15;
// var playerSpeed = 150;
var jumpTimer = 0;
var button;
var worldMaterial;
var shootTime = 0;
var weapon;
var facing = 'left';
var sndShoot;
var respawn;
var customBounds;
var Score = 0;
var scoreText;
// var gameXPsteps = 0;
var yAxis = p2.vec2.fromValues(0, 1);

var playerLevel = 0;
//#endregion
Game.Level1.prototype = {
    create: function (game) {
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = 1000;
        this.stage.backgroundColor = '#3A5963';
        map = this.add.tilemap('map');
        map.addTilesetImage('tileset');
        sndShoot = this.add.audio('shoot');
        customBounds = {left: null, right: null, top: null, bottom: null};

        layer = map.createLayer('field');
        layer.resizeWorld();

        this.createPlayer();


        this.createSphere();
        // this.createWeapon();
        this.createBullets();
        game.physics.p2.convertTilemap(map, layer);

        controls = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            up: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            shoot: this.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        };
        scoreText = game.add.text(780, 64, 'score: 0', { fontSize: '32px', fill: '#fff' });

        // game.physics.p2.setImpactEvents(true);
    },
    update: function () {
        // this.physics.arcade.collide(player, layer);
        // this.physics.arcade.collide(player, enemy1.bird, this.resetPlayer);
        enemy1.sphere.body.createBodyCallback(player, this.hitPlayer, this);
        if (enemyMini1 !== undefined) {
            enemyMini1.sphere.body.createBodyCallback(player, this.hitPlayer, this);
            enemyMini2.sphere.body.createBodyCallback(player, this.hitPlayer, this);
        }

        // if (this.bullets !== undefined)
        //     if (this.bullets.body.velocity.y > 1)
        //         this.bullets.sprite.kill();
        // if (this.bullets.position.y !== undefined)
        if (this.bullets.position.y > 88)
            this.bullets.sprite.kill();
        // player.body.velocity.x = 0;

        // playerLevel = Math.log(playerXP, gameXPsteps);
        // console.log('Level: ' + Math.floor(playerLevel));

        // this.physics.arcade.collide(sphere, layer);
        // this.physics.arcade.collide(sphere,player);
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
        // if (controls.left.isDown) {
        //     player.body.moveLeft(200);
        //     if (facing != 'left') {
        //         player.animations.play('run');
        //         player.scale.setTo(-1, 1);
        //         facing = 'left';
        //     }
        // }
        // else if (controls.right.isDown) {
        //     player.body.moveRight(200);
        //     if (facing != 'right') {
        //         player.animations.play('run');
        //         player.scale.setTo(1, 1);
        //         facing = 'right';
        //     }
        // }
        // else {
        //     player.body.velocity.x = 0;
        //     if (facing != 'idle') {
        //         player.animations.stop();
        //         facing = 'idle';
        //         player.animations.play('idle');
        //     }
        // }
        if (controls.shoot.isDown && player.alive) {
            // player.animations.play('shoot');
            // this.createWeapon();
            // this.fire();
            sndShoot.play();
            this.fireBullet();
            player.frame = 34;
            // this.shootBullet();
        }

        if (controls.up.isDown && this.time.now > jumpTimer && checkIfCanJump(this)) {
            player.body.moveUp(500);
            player.animations.play('jump');
            jumpTimer = this.time.now + 750;
        }
    },
    createPlayer: function () {
        player = this.add.sprite(100, 200, 'player');
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
        worldMaterial = this.game.physics.p2.createMaterial('Collisions', map.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial = this.game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);
        contactMaterial.restitution = 1.0;
    },
    createSplitIntoNewEnemy: function (x, y) {
        enemyMini1 = new EnemySphere('miniSphere', this.game, x, y, 'miniSphere', 10);
        enemyMini1.sphere.body.moveRight(500);
        var spriteMaterial2 = this.game.physics.p2.createMaterial('miniSphere', enemyMini1.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial2 = this.game.physics.p2.createContactMaterial(spriteMaterial2, worldMaterial);
        contactMaterial2.restitution = 1;

        enemyMini2 = new EnemySphere('miniSphere', this.game, x, y-50, 'miniSphere', 10);
        enemyMini2.sphere.body.moveLeft(550);
        var spriteMaterial3 = this.game.physics.p2.createMaterial('miniSphere', enemyMini2.sphere.body);
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        var contactMaterial3 = this.game.physics.p2.createContactMaterial(spriteMaterial3, worldMaterial);
        contactMaterial3.restitution = 1;
        // var game = this;
        // var balls = game.add.group();
        // balls.enableBody = true;
        // balls.physicsBodyType = Phaser.Physics.P2JS;

        // sphere = balls.create(810, 90, 'sphere');
        // sphere.body.setCircle(28);
        // var spriteMaterial = game.physics.p2.createMaterial('sphere', sphere.body);
        // var worldMaterial = game.physics.p2.createMaterial('Collisions', map.body);
        //
        // game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        // var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);
        // game.physics.p2.setBounds(64, 64, 880, 505, true, true, true, true);
        //
        // contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
        // contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
        // contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
        // contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
        // contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
        // contactMaterial.surfaceVelocity = 0;
        //Initiate the sphere with a force
        // sphere.body.moveLeft(400);
    },
    // createMiniSphere: function () {
    //
    // },
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
            this.bullet.body.createBodyCallback(enemy1.sphere, this.hitSphere, this);
            if (enemyMini1 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini1.sphere, this.hitSphere, this);
            if (enemyMini2 !== undefined)
                this.bullet.body.createBodyCallback(enemyMini2.sphere, this.hitSphere, this);
        }
    },
    hitSphere: function (body1, body2) {
        if (enemy1.sphere.alive)
            this.createSplitIntoNewEnemy(enemy1.sphere.x, enemy1.sphere.y);
        body2.sprite.kill();
        body1.sprite.kill();
        Score += 50;
        scoreText.text = 'Score: ' + Score;
    },
    hitPlayer: function (body1, body2) {
        body2.sprite.kill();
    },
    // createWeapon: function () {
    //     var game = this;
    //     weapon = game.add.group();
    //     weapon.enableBody = true;
    //     weapon.physicsBodyType = Phaser.Physics.P2JS;
    //     weapon.createMultiple(1, 'bullet', 0, false);
    //     weapon.setAll('anchor.x', 0.5);
    //     weapon.setAll('anchor.y', 0.5);
    //     weapon.setAll('scale.x', 0.5);
    //     weapon.setAll('scale.y', 0.5);
    //     weapon.setAll('outOfBoundsKill', true);
    //     weapon.setAll('checkWorldBounds', true);
    //     // weapon.events.onOutOfBounds.add(bulletKill, this);
    // },
    // fire: function () {
    //     //Make sure the player can't shoot when dead and that they are able to shoot another bullet
    //     if (!this.player.alive || this.time.now < this.nextFireTime) {
    //         return;
    //     }
    //
    //     this.nextFireTime = this.time.now + this.fireRate;
    //
    //     var bullet;
    //     //Properties for the basic weapon
    //     this.fireRate = 500;
    //     bullet = weapon.getFirstExists(false);
    //     bullet.reset(player.x, player.y - 40);
    //     bullet.body.velocity.y = -300;
    // },
    bulletKill: function () {
        this.bullets.kill();
    },
    // shootBullet: function () {
    //     if (this.time.now > shootTime) {
    //         weapon = weapon.getFirstExists(false);
    //         if (weapon) {
    //             weapon.reset(player.x, player.y - 40);
    //             weapon.body.moveUp(1200);
    //             shootTime = this.time.now + 900;
    //             playerXP += 15;
    //         }
    //     }
    //     weapon.body.createBodyCallback(sphere, hit, this);
    // },
    render: function () {
    }
};
function hit(body1, body2) {

    //  body1 is the body that owns the callback
    //  body2 is the body it impacted with
    // body2.sprite.animations.play('die');
    body2.sprite.kill();
    body1.sprite.kill();

}
function checkIfCanJump(game) {

    var result = false;

    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === player.body.data || c.bodyB === player.body.data) {
            var d = p2.vec2.dot(c.normalA, yAxis);

            if (c.bodyA === player.body.data) {
                d *= -1;
            }

            if (d > 0.5) {
                result = true;
            }
        }
    }

    return result;

}