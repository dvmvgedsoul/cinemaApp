$(document).ready(function () {
    $('.slider__wrapper').slick({
        centerMode: true,
        arrows: false,
        slidesToScroll: 1,
        dots: true,
        variableWidth: true,
        infinite: true,
        slidesToShow: 3,
        autoplay: false
    });
});