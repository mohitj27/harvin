let allImages = []
let slicedImages = {}
let currGallery = []
let counter = 0;
let perPage = 4;

$('document').ready(function() {
  getImagesFromServer()

  $('.chip').click(function() {
    counter = 0;
    $('.chip').removeClass('z-depth-4 active-chip')
    $('.chip').css({
      "background-color": "",
      'color': ''
    })
    $(this).addClass('z-depth-4 active-chip')
    let category = $(this).html().toLowerCase()
    $('.gallery-image').fadeOut(500)
    $('.gallery-image').remove()
    if (category == 'all')
      currGallery = allImages
    else
      currGallery = slicedImages[category]
// console.log(currGallery)
    displayCurrentGallery(currGallery)
    $('.gallery-image').fadeIn(500)

  })

  $('.pagination').on('click','a.pagination-value', function() {
    let pageNumberToDisplay = $(this).html()
    $('.pagination-value').removeClass("active-chip")
    $(this).addClass("active-chip")
    // console.log('page', pageNumberToDisplay)
    displayCurrentPageWithCategory(pageNumberToDisplay - 1)


  })


});

function getImagesFromServer() {
  $.get("/admin/db/gallery/all", function(res) {
    if (res) {
      allImages = res.images;
      currGallery = res.images;
      sliceIntoCategory(allImages)
      displayCurrentGallery(allImages)

    }
  });
}

function displayCurrentGallery(currentCategoryImages) {
  $('.pagination-value').remove()

  if (currentCategoryImages) {
    currentCategoryImages.forEach(function(image, i) {
      if (i < perPage) {
        counter++;
        makeGalleryElements(image)
      }
    })

    displayPagination(currentCategoryImages.length)

  }
}

function displayPagination(galleryLength) {
  // console.log(Math.ceil(galleryLength/perPage))
  let i=0
  let max=Math.ceil(galleryLength/perPage)
  while ( i < max ) {
    // console.log(i)
    let $pageElement = $("<li><a>"+(max-(i))+"</a> </li>")
    $pageElement.children().attr("href","#!")
    if((max-1-i)==0)
    $pageElement.children().addClass("active-chip")
    $pageElement.children().addClass("pagination-value")
   $('.pagination li:nth-child(1)').after($pageElement)
   i=i+1

  }
  $('.pagination').children().addClass("waves-effect")

}

function makeGalleryElements(image) {
  let $imageElement = $("<div><img src=" + image.src + "></div>")
  $imageElement.addClass("col s12 m4 l3 gallery-image")
  $imageElement.children().addClass("responsive-img materialboxed")
  $('.gallery-container').append($imageElement)
  $('.materialboxed').materialbox();
}

function sliceIntoCategory(allImages) {
  slicedImages = {};

  allImages.forEach((image, i) => {
    var category = image.category;
    if (slicedImages.hasOwnProperty(category)) {
      slicedImages[category].push(image)
    } else {
      slicedImages[category] = []
      slicedImages[category].push(image)
    }
  })
}
/**function that shows images at the start and pagination for all (ALL CATEGORY)**/
function displayCurrentPage(pageNumberToDisplay) {
  $('.materialboxed').toArray().forEach((img, i) => $(img).attr('src', allImages[i + perPage * pageNumberToDisplay].thumbPath))
}
/**function that shows images at the start and pagination for all (ALL CATEGORY)**/
function displayCurrentPageWithCategory(pageNumberToDisplay) {
  // console.log(currGallery)
  $('.materialboxed').toArray().forEach((img, i) => {
    // console.log(i + perPage * pageNumberToDisplay, 'val')
    let srcValue = currGallery[i + perPage * pageNumberToDisplay]
    if (srcValue) {
      $(img).show()
      $(img).attr('src', srcValue.thumbPath)
    } else {
      // console.log('hidden')
      $(img).hide()

    }
  })
}
// $(".prev-button").click(function (){
//   let pageNumberToDisplay = $("active-chip").html()
//   $('.pagination-value').removeClass("active-chip")
//   $(this).addClass("active-chip")
//   console.log('page', pageNumberToDisplay)
//   displayCurrentPageWithCategory(pageNumberToDisplay - 1)
// })
// $(".next-button").click(function (){})
