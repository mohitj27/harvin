$(document).ready(function() {
  $('ul.tabs').tabs().addClass('green-tabs z-depth-2 no-pad-top')
  // $('#navbar').removeClass('z-depth-2')
  // $('#navbar').addClass('z-depth-0')
  $('.chip').click(function() {
    $('.chip').removeClass('active-chip-rev z-depth-4')
    $(this).addClass('active-chip-rev z-depth-4')
  })
})
