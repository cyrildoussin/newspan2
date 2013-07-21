(function($) {
    var body = $('body'),
        menu = $('#menu'),
        backOne = menu.find('.backone'),
        topbar = $('#topbar'),
        isTouch = function () {

            // return !!('ontouchstart' in window) // works on most browsers
            //     || !!('onmsgesturechange' in window); // works on ie10
            return true;
        },
        // using jQuery
        getCookie = function (name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        csrfSafeMethod = function (method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        sameOrigin = function (url) {
            // test that a given url is a same-origin URL
            // url could be relative or scheme relative or absolute
            var host = document.location.host; // host + port
            var protocol = document.location.protocol;
            var sr_origin = '//' + host;
            var origin = protocol + sr_origin;
            // Allow absolute or scheme relative URLs to same origin
            return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                // or any other URL that isn't scheme relative or absolute i.e relative.
                !(/^(\/\/|http:|https:).*/.test(url));
        },
        csrftoken = getCookie('csrftoken'),
        unreadField = $('ul#status form.unread input[name="read"]'),
        starredField = $('ul#status form.starred input[name="starred"]'),
        unreadButton = $('ul#status form.unread button'),
        starredButton = $('ul#status form.starred button');

    menu.addClass('hasJs');



    backOne.on('click', function (event) {
        event.preventDefault();
        window.history.back();
    });

    topbar.on('click', function (event) {
        event.preventDefault();
        menu.toggleClass('present');
    });

    if(isTouch()) {
        body.on('swiperight', function (event) {
            menu.addClass('present');

        }).on('swipeleft', function (event) {
            if(menu.hasClass('present')) {
                menu.removeClass('present');
            } else {
                window.location.href = 'http://localhost:8000/';
            }
        });
    }

    // keyboard shortcuts
    // FIXME should be ajaxified
    body.on('keypress', function (event) {
        if ( event.which == 109 ) {         // [m]
            // $('ul#status form.unread button').click();

            $.ajaxSetup({
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
            $.ajax({
                type: 'POST',
                data: {
                    read: unreadField.val()
                },
                success: function (message) {

                    if(unreadField.val() == "true") {
                        unreadField.val("false");
                    } else {
                        unreadField.val("true");
                    }
                    // unreadField.val( !unreadField.val() );
                    console.log( unreadField.val() );

                    var disc = (unreadField.val()=="true")?'●':'○';
                    unreadButton.text(disc);

                }
            });
        }
        else if ( event.which == 115 ) {    // [s]
            // $('ul#status form.starred button').click();
            $.ajaxSetup({
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
            $.ajax({
                type: 'POST',
                data: {
                    starred: starredField.val()
                },
                success: function (message) {

                    if(starredField.val() == "true") {
                        starredField.val("false");
                    } else {
                        starredField.val("true");
                    }
                    // starredField.val( !starredField.val() );
                    console.log( starredField.val() );

                    var star = (starredField.val()=="true")?'★':'☆';
                    starredButton.text(star);

                }
            });
        }
        else {
            console.log('key code: ' + event.which);
        }
    });
}(jQuery));
