(function($) {

  $(function() {
    let i = 0;
    // Next slide
    setInterval(function() {
      if (i > 4)
        i = 0
      $('#main-landing-section').css({
        "background-image": "url(" + items[i].src + ")",
        "transition": "ease-in 1s",
        "background":"cover",
        "background-position": "center center"

      })
      console.log(items)
      i++
    }, 4000);
    $.get('/vms/gallery/student', function(students) {
      console.log(students)
      console.log('hi')
    })
  });
})(jQuery);

var items = [{
    src: './../images/1J5A2960.JPG',
    w: 600,
    h: 400
  },
  {
    src: './../images/1J5A2924.JPG',
    w: 1200,
    h: 900
  },
  {
    src: './../images/1J5A3008.JPG',
    w: 1200,
    h: 900
  },
  {
    src: './../images/1J5A3009.JPG',
    w: 1200,
    h: 900
  },
  {
    src: './../images/1J5A2924.JPG',
    w: 1200,
    h: 900
  },
  {
    src: './../images/1J5A2930.JPG',
    w: 1200,
    h: 900
  },
  {
    src: './../images/1J5A2969.JPG',
    w: 1200,
    h: 900
  },
  {
    src: './../images/1J5A2988.JPG',
    w: 1200,
    h: 900
  }
];
