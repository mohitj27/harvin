$(() => {
  console.log('up on jquery')
  var $content = $('.mdis-tab-content')
  $('.mdis-tab-item').click(function () {
    var val = $(this).prop('value')
    $('.mdis-tab-item').removeClass('activated')
    $(this).addClass('activated')
    $('.mdis-tab-content').each((i, obj) => {
      console.log('obj', typeof i, typeof val)
      if (`${i}` === val) {
        console.log('found')
        $(obj).css('display', 'block')
      }
      else {
        $(obj).css('display', 'none')
      }
    })

  })
})
function requrestMDIScallback(e) {
  e.preventDefault();
  const form = $("#form")
  const name = $("#full_name").prop("value")
  const contact = $("#contact").prop("value")
  const email = $("#email").prop("value")
  if (name.length < 1 || contact.length < 1 || email.length < 1)
    return

  $.post('/admin/enquiries', { name, contact, emailId: email, 'centerName': 'mdis' }, function (data) {
    console.log(data, "wsqewqqeqw")
    $("#full_name").prop("value") = ""
    $("#contact").prop("value") = ""
    $("#email").prop("value") = ""
  })
}
