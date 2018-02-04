var currentUser;
$(document).ready(function () {
    currentUser = getCookie("currentUser");
    if (currentUser == null) {
        $(location).attr('href','login.html');
            return false;
    } else{
        init(currentUser);
    }
});

function init(currentUser) {
        $('#userName').text(currentUser);
        var game = new Phaser.Game(960, 600, Phaser.CANVAS, '');
        game.state.add('Boot', Game.Boot);
        game.state.add('Preloader', Game.Preloader);
        game.state.add('MainMenu', Game.MainMenu);
        game.state.add('ScoreBoard', Game.ScoreBoard);
        game.state.add('Instructions', Game.Instructions);
        game.state.add('Level1', Game.Level1);
        game.state.add('Level2', Game.Level2);
        game.state.add('Level3', Game.Level3);
        game.state.add('Level4', Game.Level4);
        game.state.start('Boot');
}

function getCookie(name) {
    var index = document.cookie.indexOf(name + "=");
    if (index == -1)
        return null;
    index = document.cookie.indexOf("=", index) + 1;
    var endstr = document.cookie.indexOf(";", index);
    if (endstr == -1)
        endstr = document.cookie.length;
    return decodeURIComponent(document.cookie.substring(index, endstr));

}