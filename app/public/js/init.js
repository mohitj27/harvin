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

    let i=0;

    // Next slide
    setInterval(function() {
      if(i>4)
      i=0
      console.log('hi')
      $('.landing-container').css({"background-image": "url("+items[i].src+")","transition":"linear 2s"})
      i++;

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

var items = [{
    src: 'http://lorempixel.com/1200/900',
    w: 600,
    h: 400
  },
  {
    src: 'http://lorempixel.com/1000/900',
    w: 1200,
    h: 900
  },
  {
    src: 'http://lorempixel.com/1200/800',
    w: 1200,
    h: 900
  },
  {
    src: 'http://lorempixel.com/1300/800',
    w: 1200,
    h: 900
  },
  {
    src: 'http://lorempixel.com/1000/800',
    w: 1200,
    h: 900
  },
  {
    src: 'http://lorempixel.com/1000/900',
    w: 1200,
    h: 900
  },
  {
    src: 'http://lorempixel.com/1000/1000',
    w: 1200,
    h: 900
  },
  {
    src: 'http://lorempixel.com/1100/1000',
    w: 1200,
    h: 900
  }
];
