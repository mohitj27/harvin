(function($) {
  $(function() {
    $('.modal').modal();

    $('#harvin-card-panel2').css({'height':$('#harvin-card-panel').height().toString()})
    // $("#navbar").slideUp()
    $(window).scroll(function(){

      // if ($(window).scrollTop()>=$(window).height()/3) $("#navbar").slideDown()
      // else     $("#navbar").slideUp()
    })

    $vmsMainPanel = $('.vms-main-panel')
    let vmsMainPanelLength =  $vmsMainPanel.size()

    $vmsEventsPanel = $('.vms-events-panel')
    let vmsEventPanelLength =  $vmsEventsPanel.size()
    $vmsEventsPanel = $('.vms-events-panel').toArray()

    $.get('/gallery/category?category[]=vms-main-panel&limit='+vmsMainPanelLength, function(res){
      if(res.gallery && res.gallery.length > 0){
        let src = res.gallery[0].src
        let urlString = 'url(' +src + ')'
        $vmsMainPanel.css("background-image", urlString)
      }
    })
    $.get('/gallery/category?category[]=vms-events-panel&limit='+vmsEventPanelLength, function(res){

      if(res.gallery && res.gallery.length > 0){
        $vmsEventsPanel.forEach((panel, i) => {
          if(i < res.gallery.length){
            let src = res.gallery[i].src
            let urlString = 'url(' +src + ')'
            $(panel).css("background-image", urlString)
          }
        })
      }
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
