Game.Instructions = function (game) {
};
var allUsers;
var text;
var txtInstructions;
var txtObjects;
var objects;
Game.Instructions.prototype = {
    create: function (game) {
        titleScreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, 'titlescreen');
        titleScreen.anchor.setTo(0.5, 0.5);
        game.add.text(game.world.centerX - 152, game.world.centerY - 152, "Instrucciones de uso", {
            font: '32px Arial',
            fill: '#fff',
            align: 'center'
        });
        var objective = "El objetivo es acabar con todas las bolas que puedas, para alcanzar la mayor puntuación posible" +
            ", deberás tener cuidado con las bombas que irán cayendo. Al romper la bolas grandes pueden caer distintos" +
            " objetos que podrás recoger.";
        txtInstructions = game.add.text(game.world.centerX - 300, game.world.centerY - 100, objective, {
            font: '16px Arial',
            fill: '#fff'
        });
        txtInstructions.wordWrap = true;
        txtInstructions.wordWrapWidth = 650;

        game.add.text(game.world.centerX - 50, game.world.centerY - 20, "Objetos", {
            font: '20px Arial',
            fill: '#fff',
            align: 'center'
        });
        objects = '       +1 Vida               +150 Puntos               -50 Puntos' +
            '               5s Nueva arma';
        txtObjects = game.add.text(game.world.centerX - 250, game.world.centerY + 20, objects, {
            font: '16px Arial',
            fill: '#fff'
            // ,tabs: [ 164, 80 ]
        });
        // txtObjects.parseList(objects);
        let live = game.add.sprite(game.world.centerX - 250, game.world.centerY + 20, 'live');
        let pwrUp = game.add.sprite(game.world.centerX - 130, game.world.centerY + 15, 'powerUp');
        let barrel = game.add.sprite(game.world.centerX + 25, game.world.centerY + 15, 'barrel');
        let mGun = game.add.sprite(game.world.centerX + 160, game.world.centerY + 20, 'machineGun');
        live.scale.setTo(.7);
        pwrUp.scale.setTo(.7);
        barrel.scale.setTo(.7);
        mGun.scale.setTo(.7);

        var style = { font: "16px Arial", fill: "#fff", align: 'left', tabs: [ 164, 80 ] };
        var headings = [ 'Tecla', 'Uso'];
        text = game.add.text(game.world.centerX - 152, game.world.centerY + 80, '', {
            font: '20px Arial',
            fill: '#fff',
            align: 'center',
            tabs: [ 164, 80 ]
        });
        text.parseList(headings);

        var swords = [
            [ 'A', 'Mover hacia la izquierda' ],
            [ 'D', 'Mover hacia la derecha' ],
            [ 'W', 'Saltar' ],
            [ 'ESPACIO', 'Disparar' ]

        ];

        var text2 = game.add.text(game.world.centerX - 152, game.world.centerY + 120, '', style);
        text2.parseList(swords);
        createRoundButton(game, "", 860, 500, 60, 60, muteMusic, 1);
        createRoundButton(game, "", 780, 500, 60, 60, function () {
            game.state.start('MainMenu');
        }, 3);
    },
    update:function () {

    }
};