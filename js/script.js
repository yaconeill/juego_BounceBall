var toonavatar = require('cartoon-avatar');

var user = {};
var allUsers = [];
var url;

/**
 *
 */
$(document).ready(function () {
    var form = $('form');
    if (form.attr('id') === 'register') {
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
    allUsers = loadUserData();
    var form = $('form');
    var valid = false;
    var username = form.find('input').first();
    if (allUsers !== undefined)
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
    if (allUsers !== undefined)
        email.blur(function () {
            if (allUsers.find(o => o.email === email.val()) != null && email.val().length > 0) {
                if (email.next('span').length == 0) {
                    email.after($('<span></span>'));
                }
                email.next().text('Ya hay un usuario registrado con ese email');
                email.addClass('invalid').next().removeClass('validMsg').addClass('invalidMsg');
            }
            else {
                valid = true;
                if (email.next('span').length !== 0) {
                    email.removeClass('invalid').next().addClass('validMsg');
                    email.next().remove();
                }
            }
        });

    $('form').on('submit', function () {
        if (allUsers === undefined)
            allUsers = [];
        form.find('input').each(function () {
            if ($(this).attr('id') !== 'generateAvatar'
                && $(this).attr('id') !== 'gender')
                user[$(this).attr('id')] = $(this).val();
        });
        user.country = $('#country').find(':selected').text();
        user.url = url;
        user.level = 0;
        user.score = 0;
        allUsers.push(user);
        localStorage.setItem('users', JSON.stringify(allUsers));
        // notification('success', 'Registrado correctamente, se auto redirigirá automáticamente.');

        alert('Registrado correctamente, se redirigirá automáticamente');
        // setTimeout(function () {
        // window.location.href = 'login.html';
        $(location).attr('href', 'login.html');
        // return false;
        // }, 5000);
    });
}

/**
 *
 */
function loginForm() {
    allUsers = loadUserData();
    var form = $('form');
    form.on('click', 'button', function () {
        var username = form.find('input').first();
        var password = form.find('input').first().next();
        if (allUsers !== undefined) {
            if (allUsers.find(o => o.userName.toLowerCase() === username.val().toLowerCase()
                    && o.password === password.val()) != null) {
                setCookieMaxAge('currentUser', username.val().toLowerCase());
                $(location).attr('href', 'game.html');
                return false;
            }
        }
        else {
            notification('error', 'El usuario o la contraseña no son correctos.');
        }
    });

}

$('#signOut').on('click', function () {
    deleteOneCookie('currentUser');
    location.reload();
});
toastr.options.closeButton = true;
toastr.options.positionClass = "toast-bottom-right";

function notification(type, message) {
    if (type === 'success') {
        toastr.success(message, '<i>Éxito</i>');
    } else if (type === 'error') {
        toastr.error(message, 'Error');
    } else if (type === 'warning') {
        toastr.warning(message, 'Peligro');
    } else {
        toastr.info(message, 'Información');
    }
}

/**
 *
 */
function loadUserData() {
    if (JSON.parse(localStorage.getItem('users')) != null)
        return JSON.parse(localStorage.getItem('users'));
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
    document.cookie = name + "=" + encodeURIComponent(value) + ";max-age=" + (3600 * 24); //60 * 30 + ";";
}