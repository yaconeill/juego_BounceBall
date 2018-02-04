Game.Preloader = function (game) {
    this.preloaderBar = null;
};
var sndMusic;
Game.Preloader.prototype = {
    preload: function () {
        var allUsers = JSON.parse(localStorage.getItem('users'));
        var avatar;
        this.preloaderBar = this.add.sprite(this.world.centerX, this.centerY, 'preloaderBar');
        this.preloaderBar.anchor.setTo(0.5, 0.5);
        this.time.advancedTiming = true;
        this.load.setPreloadSprite(this.preloaderBar);

        //LOAD ALL ASSETS
        this.load.tilemap('map', '../levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('map2', '../levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('map3', '../levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('map4', '../levels/level4.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tileset', '../assets/tileset.png');

        this.load.spritesheet("player", "../assets/player.png", 130.5, 128, 45);
        this.load.physics("sprite_physics", "../assets/sprite_physics.json");

        // objeto enemigo
        this.load.image('miniSphere', '../assets/sphere_32/sphere-11.png');
        this.load.image('miniSphereGreen', '../assets/sphere_32/sphere-07.png');
        this.load.image('miniSphereCyan', '../assets/sphere_32/sphere-23.png');
        this.load.image('microSphere', '../assets/sphere_16/sphere-17.png');
        this.load.image('microSphere2', '../assets/sphere_16/sphere-07.png');
        this.load.image('sphere', '../assets/sphere_64/sphere.png');
        this.load.image('sphere2', '../assets/sphere_64/sphere2.png');
        this.load.spritesheet('bomb', '../assets/fatman.png',50, 50, 5);
        this.load.spritesheet('boom', '../assets/explosion.png',128, 128, 64);

        // objeto munición
        this.load.image('bullet', '../assets/bullet.png');

        // objetos extra
        this.load.image('barrel', '../assets/barrel.png');
        this.load.image('powerUp', '../assets/powerup.png');
        this.load.image('live', '../assets/live.png');
        this.load.image('machineGun', '../assets/machineGun.png');


        // sonidos
        this.load.audio('background',['../assets/sound/background2.mp3']);
        this.load.audio('shoot',['../assets/sound/shoot.ogg']);
        this.load.audio('jump',['../assets/sound/jump.ogg']);
        this.load.audio('hit',['../assets/sound/hit.ogg']);
        this.load.audio('pickup',['../assets/sound/pickup.ogg']);
        this.load.audio('pickuplive',['../assets/sound/pickupLive.ogg']);
        this.load.audio('bounce',['../assets/sound/bounce.ogg']);
        this.load.audio('explosion',['../assets/sound/explosion.ogg']);

        // Titulo juego
        this.load.image('titlescreen', '../assets/titlescreen.png');
        this.load.image('button', '../assets/button.png');
        this.load.spritesheet('buttons', '../assets/buttons.png', 153, 160, 5);
        this.load.image('button2', '../assets/buttonAzul.png');

        // User attributes
        var currentUser = getCookie("currentUser");
        allUsers.find(function (user) {
            if(user.userName === currentUser){
                avatar = user.url;
            }
        });
        if (avatar === undefined)
            avatar = '../assets/default.png';
        this.load.image('avatar', avatar);


    },
    create: function () {
        sndMusic = this.add.audio('background');
        sndMusic.play();
        this.state.start('MainMenu');
    }
};