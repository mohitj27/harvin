$(function () {

})
let elem

function confirmDelete (currElement) {
  elem = currElement
  var $toastContent = $('<span>Are you sure you want to Delete this User?</span>').add($('<button class="btn-flat toast-action" onClick="confirmed()">YES</button>')).add($('<button class="btn-flat toast-action" onClick="dismissed()">No</button>'))
  Materialize.toast($toastContent, 10000)
}

function dismissed () {
  Materialize.Toast.removeAll()
}

function confirmed () {
  $tr = $(elem).parent().parent()
  let userId = $tr.attr('id')

  $.ajax({
    url: '/admin/db/users/' + userId,
    method: 'DELETE',
    success: function (result) {
      $tr.fadeOut('fast', () => {
        $tr.remove()
      })
      Materialize.toast($('<span>User Deleted Successfully</span>'), 4000)
      $('.toast:last').css('background-color', '#13b38b')
    },
    error: function (error) {
      if (error) {
        Materialize.toast($('<span>' + error.responseText + '</span>'), 4000)
        $('.toast:last').css('background-color', '#f44336')
      }
    }
  })
  Materialize.Toast.removeAll()
}
