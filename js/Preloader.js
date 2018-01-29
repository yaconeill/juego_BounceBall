Game.Preloader = function (game) {
    this.preloaderBar = null;
};

Game.Preloader.prototype = {
    preload: function () {
        this.preloaderBar = this.add.sprite(this.world.centerX, this.centerY, 'preloaderBar');
        this.preloaderBar.anchor.setTo(0.5, 0.5);
        this.time.advancedTiming = true;
        this.load.setPreloadSprite(this.preloaderBar);

        //LOAD ALL ASSETS
        this.load.tilemap('map', '../levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tileset', '../assets/tileset.png');
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.sacale.pageAlignHorizontally = true;
        // this.scale.pageAlignVertically = true;
        // this.stage.disableVisibilityChange = true;

        // this.load.spritesheet('player', 'assets/player.png', 24, 26);
        // this.load.spritesheet('player', '../assets/spritesheet.png', 130, 128, 10);
        this.load.spritesheet("player", "../assets/player.png", 130.5, 128, 45);
        this.load.physics("sprite_physics", "../assets/sprite_physics.json");

        // this.load.spritesheet('buttons', 'assets/buttons.png', 193, 71);

        // objeto enemigo
        this.load.image('miniSphere', '../assets/sphere_32/sphere-11.png');
        this.load.image('sphere', '../assets/sphere.png');
        // this.load.physics("sprite_physics", "assets/sprite_physics.json");        

        // objeto munición
        this.load.image('bullet', '../assets/bullet.png');

        // sonidos
        this.load.audio('shoot',['../assets/sound/laser.mp3']);
        this.load.audio('walk',['../assets/sound/walk.wav']);

        // Titulo juego
        this.load.image('titlescreen', '../assets/titlescreen.png');

        this.load.image('button', '../assets/button.png');

    },
    create: function () {
        this.state.start('MainMenu');
    }
};