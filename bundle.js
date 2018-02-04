(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            if (allUsers.find(o => o.userName.toLowerCase() === username.val().toLowerCase() && o.password === password.val()) != null) {
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
},{"cartoon-avatar":3}],2:[function(require,module,exports){
module.exports.MALE_IMAGE_COUNT = 129;
module.exports.FEMALE_IMAGE_COUNT = 114;
},{}],3:[function(require,module,exports){
/* A Node Js Library to get cartoons style avatars */

module.exports = require('./lib/cartoon-avatar');
},{"./lib/cartoon-avatar":4}],4:[function(require,module,exports){
var config = require("../config");

var toonavatar = module.exports = {
	/**
	 * generate_avatar will generate a cartoon avatar.
	 * 
	 * @param {Object}
	 *            options
	 * @return {String}
	 */
	generate_avatar : function(options) {
		/*
		 * options = { "gender": "male" , "id":xxx}
		 * 
		 */
		var baseURL = "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/";
		var gender, id;

		if (typeof options != 'undefined' && options) {
			//If options are given but one of them is skipped
			if (typeof options.gender === 'undefined' ) {
				gender = getRandomInt(0, 1) % 2 ? "male" : "female";
			} else {
				gender = getGender(options.gender);
			}

			if ( typeof options.id === 'undefined') {
				id = getRandomInt(1,
						gender === "male" ? config.MALE_IMAGE_COUNT
								: config.FEMALE_IMAGE_COUNT);
			} else {
				id = options.id % Math.round(gender === "male" ? config.MALE_IMAGE_COUNT + 1
						: config.FEMALE_IMAGE_COUNT + 1 );
				id = (id === 0 ? 1 : id );
			}
		}else{
			//If no options are given
			gender = getRandomInt(0, 1) % 2 ? "male" : "female";
			id = getRandomInt(1,
					gender === "male" ? config.MALE_IMAGE_COUNT
							: config.FEMALE_IMAGE_COUNT);
		}
		return baseURL + gender + "/" + id + ".png";
	}

};

function getGender(gender) {

	gender = gender.trim().toLowerCase();
	if (gender === "male" || gender === "m") {
		return "male";
	} else if (gender === "female" || gender === "f") {
		return "female";
	}
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
},{"../config":2}]},{},[1]);
