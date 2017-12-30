(function($) {

  $(function() {
    let i = 0;
    // Next slide
    setInterval(function() {
      if (i > 4)
        i = 0
      $('.landing-container').css({
        "background-image": "url(" + items[i].src + ")",
        "transition": "linear 2s"
      })
      i++
    }, 4000);
    $.get('/vms/gallery/student', function(students) {
      console.log(students)
      console.log('hi')
    })
  });
})(jQuery);
