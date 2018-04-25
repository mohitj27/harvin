const emptyFields = () => {
  $('#name').val('')
  $('#phone').val('')
  $('#emailId').val('')
  $('#classs').val('')
}

$(function () {
  $('#submit-btn').on('click', function (e) {
    e.preventDefault()
    const newEnquiry = {}
    const name = $('#name').val()
    const emailId = $('#emailId').val()
    const phone = $('#phone').val()
    const classs = $('#classs').val()
    const centerName = $('#courseName').val()
    if (!name || !emailId || !phone) return
    newEnquiry.name = name
    newEnquiry.emailId = emailId
    newEnquiry.phone = phone
    newEnquiry.classs = classs
    newEnquiry.centerName = centerName

    $.ajax({
      url: '/admin/enquiries',
      method: 'post',
      data: newEnquiry,
      success: function (result) {
        Materialize.toast(
          $('<span>Successfully Saved Your Response</span>'),
          4000
        )
        $('.toast:last').css('background-color', '#13b38b')
      },
      error: function (error) {
        if (error) {
          Materialize.toast($('<span>' + error.responseText + '</span>'), 4000)
          $('.toast:last').css('background-color', '#f44336')
        }
      },
      complete: emptyFields
    })
  })
})
