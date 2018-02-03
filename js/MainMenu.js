Game.MainMenu = function (game) {
    
};

var titlescreen;
var sndMusic;
Game.MainMenu.prototype = {
    create: function (game) {
        this.createButton(game, "Play", game.world.centerX, game.world.centerY + 32, 300, 100, 
        function () {
            this.state.start('Level3');
            // this.state.start('Level1');
        });

        this.createButton(game, 'About', game.world.centerX, game.world.centerY + 192, 300, 100, 
        function () {
            console.log('About');
        });
        sndMusic = game.add.audio('background');
        sndMusic.play();
        titlescreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'titlescreen');
        titlescreen.anchor.setTo(0.5, 0.5);
    },

    update: function (game) {
        
    },

    createButton: function (game, string, x, y, w, h, callback) {
        var button1 = game.add.button(x, y, 'button2', callback, this, 2, 1, 0);

        button1.anchor.setTo(0.5, 0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, string, {
            font: '18px Arial',
            fill: '#000',
            align: 'center'
        });
        txt.anchor.setTo(0.5, 0.5);
    }    
};