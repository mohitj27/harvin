let allImages = []
let slicedImages = {};
let counter=0;
let perPage = 4;

$('document').ready(function() {
  getImages();
  $('.chip').click(function() {
    counter = 0;
    $('.chip').removeClass('z-depth-4 active-chip')
    $('.chip').css({
      "background-color": "",
      'color': ''
    })
    $(this).addClass('z-depth-4 active-chip')
    let data = $(this).html().toLowerCase()
    $('.gallery-image').fadeOut(1000)
    $('.gallery-image').remove()
    if(data === 'all'){
      displayCurrentCategoryImages(allImages);

    }else {
      displayCurrentCategoryImages(slicedImages[data]);

    }
  })

  $('.pagination > li > a').on('click', (e) => {
    console.log('click', $(e.currentTarget).text())
    pageNumberToDisplay = $(e.currentTarget).text()
    displayCurrentPage(pageNumberToDisplay)
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

  //
  // let startGallery = function() {
  //   // Initializes and opens PhotoSwipe
  //   let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
  //
  //   gallery.init()
  //
  // }
  // $('.main-img').click(startGallery)


});

function moreImages(){
console.log('moreImages')
let data = $('.active-chip').html().toLowerCase()
}

function getImages(){
  $.get("/db/gallery/all", function(res) {
    console.log('res',res);
    if(res){
      allImages = res.images;
      sliceIntoCategory(allImages)
      displayCurrentCategoryImages(allImages);
    }
  });
}

function displayCurrentCategoryImages(currentCategoryImages){
  if(currentCategoryImages){
    currentCategoryImages.forEach(function(image, i) {
      if(i < perPage){
        counter = counter + 1;
        console.log(counter)
        let $imageElement = $("<div><img src=" + image.src + "></div>")
        $imageElement.addClass("col s12 m4 l3 gallery-image")
        $imageElement.children().addClass("responsive-img materialboxed")
        // console.log($imageElement.children().height())
          $('.gallery-container').append($imageElement)
          $('.materialboxed').materialbox();
      }
    })
  }
}

function sliceIntoCategory(allImages){
  slicedImages = {};

  allImages.forEach((image, i) => {
    var category = image.category;
    if(slicedImages.hasOwnProperty(category)){
      slicedImages[category].push(image)
    }
    else{
    slicedImages[category]=[]
    slicedImages[category].push(image)}

  })

  return slicedImages;
}

function displayCurrentPage(pageNumberToDisplay){
  // console.log($('.gallery-container').children())

  $imgNeedsToUpdate = $('.materialboxed');
  $imgNeedsToUpdate.forEach((img, i) => {
    img.attr('scr', currentCategoryImages[i + perPage * pageNumberToDisplay])
  })
}