(function($) {
  $(function() {


    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    // $('.carousel').carousel();
    $('.carousel').carousel({
      fullWidth: true
    });


    $('.tap-target').tapTarget('open');
    state=true;
    // $('.tap-target').tapTarget('close');


    // Next slide
    //
    // setInterval(function() {
    //   $('.carousel').carousel('next');
    // }, 4000);
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
console.log('scroll')
  $('html, body').animate({
    scrollTop: $("#content").offset().top
  }, 1000);

}


// $('.carousel.carousel-slider').carousel({fullWidth: true});
