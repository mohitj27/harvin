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


  // declare variable
  var scrollTop = $(".scrollTop");

  $(window).scroll(function() {
    // declare variable
    var topPos = $(this).scrollTop();

    // if user scrolls down - show scroll to top button
    if (topPos > 100) {
      $(scrollTop).css("opacity", "1");

    } else {
      $(scrollTop).css("opacity", "0");
    }

  }); // scroll END

  //Click event to scroll to top
  $(scrollTop).click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 800);
    return false;

  }); // click() scroll top EMD

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
    scrollTop: $("#features").offset().top
  }, 1000);

}
