$(function () {
  if ($('.pagination').length > 0) {
    let activePage = $('.active-chip').text();
    // console.log('activepage1', activePage)
    activePage = +activePage.trim();
    let prevPage = activePage - 1;
    let nextPge = activePage + 1;

    $('#prev-button').attr('href', '/blog?page=' + prevPage);
    $('#next-button').attr('href', '/blog?page=' + nextPge);
  }

  $('.carousel.carousel-slider').carousel({ fullWidth: true });

});
function paginationClick(e){
  const value=$(e).data('value');
  if($(".active-chip").data('value')!=$(e).data('value')){
    $(".active-chip").removeClass("active-chip")
    $(e).addClass("active-chip")
    $.getJSON(`page/?page=${value}`,function(data){
      $('.latest-post-grid').remove()
      const $BlogsHTML=$(".latest-post-grid")
      data.forEach(function(val,i)  {
        console.log(val)
          $('#latest-post-container').prepend(`
          <div class="latest-post-grid">
          <div class="latest-post-image">
            <img class="responsive-img latest-post-image" src="/blogImage/${data[i].coverImgName}" alt=""/>
          </div>
          <div class="latest-post-info">
              <a href="/blog/${data[i].url}" style="color:#000000c7;">
              <h4 class="dark-font">  ${data[i].blogTitle}</h4>
              <p>${data[i].uploadDate}</p>
              </a>
              <a class="twitter-share-button" href="https://twitter.com/intent/tweet">
                  Tweet</a>
                  <a class="fb-share-button" data-href="https://harvin.academy/blog/${data[i].url}" data-layout="button_count">
                  Share
                  </a>
          </div>
        </div>
          `)
      });
    })
  }
}