(function($) {
  $(function() {


    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    // $('.carousel').carousel();
    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicator: true
    });

    $('.tap-target').tapTarget('open');
    state=true;
    // $('.tap-target').tapTarget('close');


    // Next slide

    setInterval(function() {
      $('.carousel').carousel('next');
    }, 4000);
  }); // end of document ready
})(jQuery); // end of jQuery name space
var state=true;
function tap() {
  console.log('tap');
  if (!state) {
    $('.tap-target').tapTarget('open');

    state = true;
  } else {
     $('.tap-target').tapTarget('close');
     state=false;

  }

}

function scrollDown() {

  $('html, body').animate({
    scrollTop: $("#carousel1").offset().top
  }, 1000);

}


// $('.carousel.carousel-slider').carousel({fullWidth: true});
