$('document').ready(function() {
  var pswpElement = document.querySelectorAll('.pswp')[0];
  // build items array
  $('.chip').click(function() {
    $('.chip').removeClass('z-depth-4 active-chip')
    $('.chip').css({
      "background-color": "",
      'color': ''
    })
    $(this).addClass('z-depth-4 active-chip')
    let data = $(this).html().toLowerCase()
    $('.gallery-image').fadeOut(1000)
    $('.gallery-image').remove()
    $.get("/vms/gallery/" + data, function(res) {
      console.log(res);
      console.log(res.gallery[1]);
      res.gallery.forEach(function(image, i) {
        let $imageElement = $("<div><img src=" + image.src + "></div>")
        $imageElement.addClass("col l3 s12 gallery-image")
        $imageElement.children().addClass("responsive-img materialboxed")
        console.log($imageElement.children().height())
        $('.materialboxed').materialbox();


          $('.gallery-container').append($imageElement)
      })
    });
  })

  $(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() == $(document).height()) {
       moreImages()
         console.log('hi');

     }
  });
  // define options (if needed)
  var options = {
    // optionName: 'option value'
    // for example:
    index: 1 // start at first slide
  };


  let startGallery = function() {
    // Initializes and opens PhotoSwipe
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)

    gallery.init()

  }
  $('.main-img').click(startGallery)


});
function moreImages(){
console.log('moreImages')
let data = $('.active-chip').html().toLowerCase()

  $.get("/vms/gallery/" + data,{images:4,counter:counter}, function(res) {
    counter++;
    console.log(counter);
      currGallery=res.gallery;
    res.gallery.forEach(function(image, i) {
      let $imageElement = $("<div><img src=" + image.src + "></div>")
      $imageElement.addClass("col l3 s12 gallery-image ")
      $imageElement.children().addClass("responsive-img materialboxed")
      console.log($imageElement.children().height())

        $('.gallery-container').append($imageElement)
    })
  });

}
let counter=0;
let currGallery;
