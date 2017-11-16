$(function() {

    var headerMenu = $('.header_info');
    var burger = $('.menu-burger');

    if($(window).width() <= 360) {

        burger.on('click', function() {
            headerMenu.toggleClass('js-toggle', 2000);
        })
    }


})