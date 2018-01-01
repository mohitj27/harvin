$(document).ready(function(){
   $('ul.tabs').tabs().addClass('green-tabs z-depth-2 no-pad-top')
   // $('#navbar').removeClass('z-depth-2')
   // $('#navbar').addClass('z-depth-0')
   $('ul.tabs').onShow(curr=>{
     console.log('tab selected')
   })
 })
