$(document).ready(function () {
    var currentUser = getCookie("currentUser");
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
    game.state.add('Level1', Game.Level1);
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

function deleteOneCookie(key) {
    console.log("Se ha eliminado la Cookie: " + key);
    return document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
 *  Cookies functions
 */
function setCookieMaxAge(name, value) {
    // Max Age 30 min
    document.cookie = name + "=" + encodeURIComponent(value) + ";max-age=" + 60 * 30 + ";";
}
