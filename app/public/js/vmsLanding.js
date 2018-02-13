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

    $.get('/gallery/category?category[]=vms-main-panel&limit='+vmsMainPanelLength, function(res){
      if(res.gallery){

      }
    })
    $.get('/gallery/category?category[]=vms-events-panel&limit='+vmsEventPanelLength, function(res){

      if(res.gallery){
        
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
