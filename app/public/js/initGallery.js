$('document').ready(function() {

  var pswpElement = document.querySelectorAll('.pswp')[0];

  // build items array

  console.log('gallery');
  // define options (if needed)
  var options = {
    // optionName: 'option value'
    // for example:
    index: 1 // start at first slide
  };

  let startGallery=function(){
    // Initializes and opens PhotoSwipe
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)

    gallery.init()

  }
  $('.main-img').click(startGallery)
});
var items = [{
    src: 'https://placekitten.com/600/400',
    w: 600,
    h: 400
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  },
  {
    src: 'https://placekitten.com/1200/900',
    w: 1200,
    h: 900
  }
];
