var toonavatar = require('cartoon-avatar');

var user = {};
var allUsers = [];
var url;

/**
 * 
 */
$(document).ready(function () {
    var form = $('form');
    if (form.attr('id') === 'register'){
        /**
     * Bootstrap
     */
        $(function () {
            $('#toggle-two').bootstrapToggle({
                on: 'Enabled',
                off: 'Disabled'
            });
        });
        registerForm();
    }
    if (form.attr('id') === 'login') {
        var currentUser = getCookie("currentUser");
        if (currentUser == null) {
            loginForm();
        } else {
            $(location).attr('href', 'game.html');
            return false;
        }
    }
    if (window.location.pathname === '/index.html') {
        var currentUser = getCookie("currentUser");
        if (currentUser == null) {
            // $(location).attr('href','login.html');
            //     return false;
        } else {
            $('.navbar-nav').find('.nav-item').children().remove();
        }
    }

});

/**
 * 
 */
function registerForm() {
    loadUserData();
    var form = $('form');
    var valid = false;
    var username = form.find('input').first();
    username.blur(function () {
        if (allUsers.find(o => o.userName === username.val()) != null &&
            username.val().length > 0) {
            if (username.next('span').length == 0) {
                username.after($('<span></span>'));
            }
            username.next().text('El nombre de usuario ya existe');
            username.addClass('invalid').next().removeClass('validMsg').addClass('invalidMsg');
        }
        else {
            valid = true;
            if (username.next('span').length != 0) {
                username.removeClass('invalid').next().addClass('validMsg');
                username.next().remove();
            }
        }
    });

    $('#generateAvatar').on('click', function () {
        var gender = {};
        var genderSwitch = $('#gender');
        if (genderSwitch.prop('checked'))
            gender.gender = 'male';
        else
            gender.gender = 'female';
        url = toonavatar.generate_avatar(gender);
        $('#avatar').attr('src', url);
    });

    var email = form.find('#email');
    email.blur(function () {
        if (allUsers.find(o => o.email === email.val()) != null &&
            email.val().length > 0) {
            if (email.next('span').length == 0) {
                email.after($('<span></span>'));
            }
            email.next().text('Ya hay un usuario registrado con ese email');
            email.addClass('invalid').next().removeClass('validMsg').addClass('invalidMsg');
        }
        else {
            valid = true;
            if (email.next('span').length != 0) {
                email.removeClass('invalid').next().addClass('validMsg');
                email.next().remove();
            }
        }
    });

    $('form').on('submit', function () {
        form.find('input').each(function () {
            if ($(this).attr('id') != 'generateAvatar' ||
                $(this).attr('id') != 'gender')
                user[$(this).attr('id')] = $(this).val();
        });
        user.country = $('#country').find(':selected').text();
        user.url = url;
        allUsers.push(user);
        localStorage.setItem('users', JSON.stringify(allUsers));
        alert('Registrado correctamente, se auto redirigirá en 5 segundos');
        // setTimeout(function () {
        $(location).attr('href', 'login.html');
        // return false;
        // }, 5000);
    });
}

/**
 * 
 */
function loginForm() {
    loadUserData();
    var form = $('form');
    form.on('submit', function () {
        var username = form.find('input').first();
        var password = form.find('input').first().next();
        if (allUsers.find(o => o.userName.toLowerCase() === username.val().toLowerCase() && o.password === password.val()) != null) {
            setCookieMaxAge('currentUser', username.val().toLowerCase());
            $(location).attr('href', 'game.html');
            return false;
        }
        else {
            alert('Usuario no encontrado');
        }
    });

}

$('#signOut').on('click', function () {
    deleteOneCookie('currentUser');
    location.reload();
});

/**
 * 
 */
function loadUserData() {
    if (JSON.parse(localStorage.getItem('users')) != null)
        allUsers = JSON.parse(localStorage.getItem('users'));
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