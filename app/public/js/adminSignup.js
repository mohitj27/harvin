$(function () {
  $('#submit-btn').on('click', function e (e) {
    e.preventDefault()
    const instituteName = $('#instituteName').val()
    const username = $('#username').val()
    const centerName = $('#centerName').val()
    const password = $('#password').val()
    const role = []

    $.each($('#role option:selected'), function () {
      role.push($(this).val())
    })

    console.log('role', role)

    $.ajax({
      url: '/admin/signup',
      method: 'post',
      data: {
        instituteName,
        username,
        centerName,
        password,
        role
      },
      success: function (res) {
        if (res) {
          console.log('res', res)
          Materialize.toast($('<span>Signup successfull</span>'), 4000)
          $('.toast:last').css('background-color', '#13b38b')
        }
      },
      error: function (err) {
        if (err) {
          console.log('err', err)
          Materialize.toast($('<span>' + err.responseText + '</span>'), 4000)
          $('.toast:last').css('background-color', '#f44336')
        }
      },
      complete: function () {
        console.log('complete')
      }
    })
  })
})
