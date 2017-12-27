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

window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
// $('.carousel.carousel-slider').carousel({fullWidth: true});
