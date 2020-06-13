$(document).ready(function(){


    $('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });

    $('.adv-item:first-child').addClass('active').find('.adv-item-content').show();

    /**
     * mobile-mnu customization
     */
    var mmenu = $('#mobile-mnu');
    var menuLogo = mmenu.data("logo");
    var $mmenu = mmenu.mmenu({
        navbars: [{
            content: [ "<img src=" + menuLogo + " class=\"img-responsive mm-logo\" alt=\"alt\"/>" ],
        }],
        "pageScroll": true,

        "navbar": {
            "title" : "",
        },
        "extensions": [
            "theme-dark",
            "pagedim-black",
            "position-front",
            "fx-listitems-slide",
        ],
    }, {
        offCanvas: {
            pageSelector: "#page-container"
        },
    });

    var mmenuBtn = $("#mmenu-btn");
    var API = $mmenu.data("mmenu");

    mmenuBtn.click(function() {
        API.open();
        $(this).addClass('is-active')
    });


    API.bind( "close:start", function() {
        setTimeout(function() {
            mmenuBtn.removeClass( "is-active" );
        }, 300);
    });
    /**
     * end mobile-mnu customization
     */



    function heightses() {
        if ($(window).width()>=768) {
            // $('.why-item').height('auto').equalHeights();
        }
    }

    $(window).resize(function() {
        heightses();
    });

    heightses();

    $('.catalog-tabs-wrap').tabs({
        activate: function( event, ui ) {
            bubbles();
        }
    });

    $('.adv-item-btn').click(function(){
        var th = $(this);
        var parent = th.parents('.adv-item');
        var content = th.siblings('.adv-item-content');

        parent.toggleClass('active');
        content.slideToggle();

        parent.siblings('.adv-item').removeClass('active').find('.adv-item-content').slideUp();
    })

    $(function() {
        $("a[href='#popup-form'], a[href='#product-form'], a[href='#order-form']").magnificPopup({
            type: "inline",
            fixedContentPos: !1,
            fixedBgPos: !0,
            overflowY: "auto",
            closeBtnInside: !0,
            preloader: !1,
            midClick: !0,
            removalDelay: 300,
            mainClass: "my-mfp-zoom-in"
        })
    });

    $("a[href='#product-form']").on('click', function(){
        var th = $(this);
        var model = th.data('model');

        $('#product-model').val(model);
        $('#product-model-desc').find('span').text(model);
    })

    $("a[href='#order-form']").on('click', function(){
        var th = $(this);
        var model = th.data('model');

        $('#order-model').val(model);
        $('#order-model-desc').find('span').text(model);
    })

    /** FORMS START*/
    var uPhone = $('.user-phone');
    uPhone.mask("+7 (999) 999-99-99",{autoclear: false});

    uPhone.on('click', function (ele) {
        var needelem = ele.target || event.srcElement;
        needelem.setSelectionRange(4,4);
        needelem.focus();
    });

    $.validate({
        form : '.contact-form',
        scrollToTopOnError: false
    });

    //E-mail Ajax Send
    $("form").submit(function() { //Change
        var th = $(this);
        var t = th.find(".btn").text();
        th.find(".btn").prop("disabled", "disabled").addClass("disabled").text("Отправлено!");

        $.ajax({
            type: "POST",
            url: "/mail.php", //Change
            data: th.serialize()
        }).done(function() {
            setTimeout(function() {
                th.find(".btn").removeAttr('disabled').removeClass("disabled").text(t);
                th.trigger("reset");
                $.magnificPopup.close();
            }, 2000);
        });
        return false;
    });


    /** MAP START */
    function loadScript(url, callback){
        var script = document.createElement("script");

        if (script.readyState){  // IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  // Другие браузеры
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }


    function initMap() {
        ymaps.ready(function(){
            var mapId = $('#map'),
                attitude = mapId.data("att"),
                longtitude = mapId.data("long"),
                zoom = mapId.data("zoom"),
                marker = mapId.data("marker"),
                addr = mapId.data("adr"),
                map = new ymaps.Map("map", {
                    center: [attitude, longtitude],
                    controls: ['zoomControl'],
                    zoom: zoom
                }),
                myPlacemark = new ymaps.Placemark(map.getCenter(), {}, {
                    // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: marker,
                    // Размеры метки.
                    iconImageSize: [30, 45],
                });



            if ($(window).width()<415) {
                map.geoObjects.add(myPlacemark);
            } else {
                // Открываем балун на карте (без привязки к геообъекту).
                map.balloon.open(map.getCenter(), '<span class="baloon-addr">'+addr+'</span>', {
                    // Опция: не показываем кнопку закрытия.
                    closeButton: false
                });
            }
        });
    }

    if( $('#map').length )         // use this if you are using id to check
    {
        setTimeout(function(){
            loadScript("https://api-maps.yandex.ru/2.1/?apikey=e470b388-a1d0-4edf-acdc-34b4bc5bedee&lang=ru_RU&loadByRequire=1", function(){
                initMap();
            });
        }, 2000);
    }
    /** MAP END */


    $(".main-mnu a, .btn-scroll").mPageScroll2id({
        offset: 100
    });

    if($(window).width() >= 768) {
        $(window).scroll(function() {
            if($(this).scrollTop() > 30) {
                $('.s-intro').addClass('sticky')
            } else {
                $('.s-intro').removeClass('sticky')
            }
        });
    }


    $(".main-mnu a, .btn-scroll").mPageScroll2id({
        offset: 60
    });


    $(document).on('scroll', function() {
        var posDoc = $(this).scrollTop();

        $('section').each(function(){
            var id = $(this).data("id");
            var topHeader = $(this).offset().top - 100;
            var botHeader = topHeader + $(this).height() - 100;

            if (
                posDoc > topHeader &&
                posDoc < botHeader &&
                id
            ) {
                $('.main-mnu li').removeClass("active");
                $( '.main-mnu li a[href="#' + id + '"]' ).parents("li").addClass("active");
            }
        });
    });


    var bubbles = function() {
        $('.move').remove();
        var items=500;
        for (var i=0 ;i <= items; i++ ) {
            var moveVal = Math.ceil(Math.random() * 50);
            var posVal = Math.ceil(Math.random() * 50);
            var scaleVal = Math.ceil(Math.random() * 10);
            var shakeVal = Math.ceil(Math.random() * 5);
            var stretch = Math.ceil(Math.random() * 5);
            $(".s-catalog").append('<div class="move move' + moveVal + ' pos' + posVal + '"><div class="scale' + scaleVal + '"><div class="item shake' + shakeVal + '"><span class="item stretch' + stretch + '"></span></div></div>');
        }
    }

    bubbles();

    setTimeout(function(){
        $('.preloader').fadeOut();
    }, 300)



});
