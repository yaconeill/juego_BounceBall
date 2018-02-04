Game.ScoreBoard = function (game) {
};
var allUsers;
Game.ScoreBoard.prototype = {
    create: function (game) {
        loadUserData();
        titleScreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'titlescreen');
        titleScreen.anchor.setTo(0.5, 0.5);
        game.add.text(game.world.centerX - 152, game.world.centerY - 152, "Mejores puntuaciones", {
            font: '32px Arial',
            fill: '#fff',
            align: 'center'
        });
        createRoundButton(game, "", 860, 500, 60, 60, muteMusic, 1);
        createRoundButton(game, "", 780, 500, 60, 60, function () {
            game.state.start('MainMenu');
        }, 3);
        let length = allUsers.length;
        let zero = 0;
        if (length > 10)
            length = 10;
        if(length !== 0){
            for (let i = 0, pos = 0; i < length; i++, pos-=35){
                if (allUsers[i].score !== 0){
                    game.add.text(game.world.centerX - 152, game.world.centerY - 100 - pos, (i + 1) +'. ' + allUsers[i].userName.toUpperCase(), {
                        font: '22px Arial',
                        fill: '#fff',
                        align: 'center'
                    });
                    game.add.text(game.world.centerX + 100, game.world.centerY - 100 - pos, allUsers[i].score, {
                        font: '22px Arial',
                        fill: '#fff',
                        align: 'right'
                    });
                } else
                    zero ++;
            }
        } else
            showNoScore(game);
        if (zero === length)
            showNoScore(game);
    },
    update:function () {

    }
};
function showNoScore(game) {
    game.add.text(game.world.centerX - 152, game.world.centerY - 100,'No hay puntuaciones disponibles', {
        font: '22px Arial',
        fill: '#fff',
        align: 'center'
    });
}