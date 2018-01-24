Game.Preloader = function (game) {
    this.preloaderBar = null;
};

Game.Preloader.prototype = {
    preload: function () {
        this.preloaderBar = this.add.sprite(this.world.centerX, this.centerY, 'preloaderBar');
        this.preloaderBar.anchor.setTo(0.5, 0.5);
        this.time.advancedTiming = true;
        this
            .load
            .setPreloadSprite(this.preloaderBar);

        //LOAD ALL ASSETS
        this.load.tilemap('map', '../levels/level1.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('tileset', '../assets/tileset.png');

        // this.load.spritesheet('player', 'assets/player.png', 24, 26);
        // this.load.spritesheet('player', '../assets/spritesheet.png', 130, 128, 10);
        this.load.spritesheet("player", "../assets/player.png", 130, 128, 45);
        this.load.physics("sprite_physics", "../assets/sprite_physics.json");

        // this.load.spritesheet('buttons', 'assets/buttons.png', 193, 71);

        // objeto enemigo
        this.load.image('bird', '../assets/bird.png');
        this.load.image('sphere', '../assets/sphere.png');
        // this.load.physics("sprite_physics", "assets/sprite_physics.json");        

        // objeto munición
        this.load.image('nut', '../assets/nut.png');

        // Titulo juego
        this.load.image('titlescreen', '../assets/titlescreen.png');

        this.load.image('button', '../assets/button.png');
        
    },
    create: function () {
        this.state.start('MainMenu');
    }
};