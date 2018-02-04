Game.MainMenu = function (game) {

};
var allUsers;
var titleScreen;
Game.MainMenu.prototype = {
    create: function (game) {
        loadUserData();
        this.createButton(game, "Jugar", game.world.centerX, game.world.centerY + 32, 300, 100,
            function () {
                this.state.start('Level1');
            });

        this.createButton(game, 'Instrucciones', game.world.centerX, game.world.centerY + 192, 300, 100,
            function () {
                this.state.start('Instructions');
            });
        createRoundButton(game, "", 860, 500, 60, 60, muteMusic, 1);
        createRoundButton(game, "", 780, 500, 60, 60, function () {
            game.state.start('ScoreBoard');
        }, 2);
        titleScreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'titlescreen');
        titleScreen.anchor.setTo(0.5, 0.5);
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
    },
};
function createRoundButton(game, string, x, y, w, h, callback, frame) {
    var button1 = game.add.button(x, y, 'buttons', callback, this);
    button1.frame = frame;
    button1.anchor.setTo(0.5, 0.5);
    button1.width = w;
    button1.height = h;
    if (string !== ""){
        var txt = game.add.text(button1.x, button1.y, string, {
            font: '18px Arial',
            fill: '#000',
            align: 'center'
        });
        txt.anchor.setTo(0.5, 0.5);
    }

}
function muteMusic() {
    sndMusic.isPlaying ? sndMusic.pause() : sndMusic.resume();
}
function loadUserData() {
    allUsers = JSON.parse(localStorage.getItem('users'));
    if(allUsers !== null){
        allUsers.sort(function (a, b) {
            return b.score - a.score;
        });
        localStorage.setItem('users', JSON.stringify(allUsers));
    }else
        allUsers = [];
}