(function($) {
  $(function() {


    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    // $('.carousel').carousel();
    $('.carousel').carousel({
      fullWidth: true
    });

    $('.tap-target').tapTarget('open');
    state = true;
    // $('.tap-target').tapTarget('close');


    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space
var state = true;

function tap() {
  console.log('tap');
  if (!state) {
    $('.tap-target').tapTarget('open');

    state = true;
  } else {
    $('.tap-target').tapTarget('close');
    state = false;

  }

}

function scrollDown() {
  console.log('scroll')
  $('html, body').animate({
    scrollTop: $("#content").offset().top
  }, 1000);

}
