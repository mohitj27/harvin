(function($) {
  $(function() {
    $('#harvin-card-panel2').css({'height':$('#harvin-card-panel').height().toString()})
    // $("#navbar").slideUp()
    $(window).scroll(function(){

      // if ($(window).scrollTop()>=$(window).height()/3) $("#navbar").slideDown()
      // else     $("#navbar").slideUp()
    })

  });
})(jQuery);

var items = [{
    src: './../images/hero01.jpg',
    w: 600,
    h: 400
  },
  {
    src: './../images/hero02.jpg',
    w: 1200,
    h: 900
  },
  {
    src: './../images/hero03.jpg',
    w: 1200,
    h: 900
  },
  {
    src: './../images/hero04.jpg',
    w: 1200,
    h: 900
  }
];
