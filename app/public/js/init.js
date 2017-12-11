(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    // $('.carousel').carousel();
    $('.carousel.carousel-slider').carousel({fullWidth: true, indicator: true});

  }); // end of document ready
})(jQuery); // end of jQuery name space


function scrollDown(){
  
$('html, body').animate({
  scrollTop: $("#carousel1").offset().top
  }, 1000);

}

// $('.carousel.carousel-slider').carousel({fullWidth: true});