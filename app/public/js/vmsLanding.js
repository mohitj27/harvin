(function($) {
  $(function() {
    $('#harvin-card-panel2').css({'height':$('#harvin-card-panel1').height()})
    $("#navbar").slideUp()
    $(window).scroll(function(){

      if ($(window).scrollTop()>=$(window).height()/2) $("#navbar").slideDown()
      else     $("#navbar").slideUp()
    })
    let i = 0;
    // Next slide
    // setInterval(function() {
    //   if (i >= 4)
    //     i = 0
    //   $('#main-landing-section').css({
    //     "background-image": "url(" + items[i].src + ")",
    //     "transition": "ease-in 1s",
    //     "background":"cover",
    //     "background-position": "center center"
    //
    //   })
    //   console.log(i)
    //   i++
    // }, 4000);
    $.get('/vms/gallery/student', function(students) {
      console.log(students)
      console.log('hi')
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
