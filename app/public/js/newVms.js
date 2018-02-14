$(function(){
  $('select').material_select();
  $('#referral-select').on('change', function(e){
    if($(this).val() === 'Other'){
      $('#referral-text').parent().css('display', 'block')

      $(this).attr('name', 'referral-select')
      $(this).removeAttr('required')

      $('#referral-text').attr('name', 'referral')
      $('#referral-text').attr('required', 'true')

    } else {
      $('#referral-text').parent().css('display', 'none')

      $('#referral-text').attr('name', 'referral-text')
      $('#referral-text').removeAttr('required')

      $(this).attr('name', 'referral')
      $(this).attr('required', 'true')
    }
  })
})
