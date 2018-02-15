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

  $('.class-selector').on('click', function(){
    $classs = $('#classs')
    $classs.val($(this).text())
    $classSelectorWrapperChildren = $('#class-selector-wrapper').children().toArray();
    $classSelectorWrapperChildren.forEach(element => {
      $(element).removeClass('active-class')
      $(element).addClass('white')
      $(element).children().removeClass('white-text', 'teal-text')
      $(element).children().addClass('teal-text')
    });
    $(this).addClass('active-class')
    $(this).children().addClass('white-text')

  })

  $('#new-vms-form').submit(function(){
    const domain = $('#domain-select').val()
    if(domain !== 'other'){
      $('#emailId').val($('#emailId').val() + domain)
    }

  })

})
