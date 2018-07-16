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
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
function requrestMDIScallback(e) {
  // e.preventDefault();
  // const form = $("#form")
  const name = $("#full_name").val()
  const contact = $("#contact").val()
  const email = $("#email").val()
  if (name.length < 1 || contact.length < 1 || email.length < 1 || !isEmail(email)) {
    Materialize.toast("Please check fields ..!", 1500)
    $(".toast").css("background-color", "red");
    return
  }

  $.post('/admin/enquiries/', { name: name, contact: contact, emailId: email, 'centerName': 'mdis' })
    .done(function (data) {
      console.log("form submittedß")
      Materialize.toast("Registered Successfully !! ", 1500)
      $(".toast").css("background-color", "#229976");
      $("#full_name").val('')
      $("#contact").val('')
      $("#email").val('')
      return
    })

}
