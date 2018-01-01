
$(function(){
  $('.chip').click(function(){
    $('.chip').removeClass('z-depth-4 active-chip')
    $(this).addClass('z-depth-4 active-chip')

    switch ($(this).html()) {
      case 'Janakpuri':
$('.map').attr('src',locations[0])
        break;
      case 'Preet Vihar':
$('.map').attr('src',locations[1])
        break;

      case 'Meerut':
$('.map').attr('src',locations[2])
        break;

      default:
    }


  })
})
let locations=[
`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1866.513029811001!2d77.072
9616649987!3d28.62788130498618!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x16b6ad9
a405afd25!2sHarvin+Academy!5e0!3m2!1sen!2sin!4v1499683098899`,

`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56025.53693796154!2d77.25
678771665312!3d28.641866248905934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m
2!1s0x390cfb56d7a68be1%3A0xc0d24e384452c9f7!2sHarvin+Academy!5e0!3m2!1sen!2sin!4
v1493884209281`,

`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3490.0766360404123!2d77.70
96114!3d28.9851!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c64e3588e762d%3A0xcc63361
beea3ad6f!2sSaraswati+Plaza!5e0!3m2!1sen!2sin!4v1493885153091`
]
