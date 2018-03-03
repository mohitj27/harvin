$(function() {

})
let elem

function confirmDelete(currElement) {
  dismissed()
  elem = currElement
  var $toastContent = $('<span>Are you sure you want to Delete this POST?</span>').add($('<button class="btn-flat toast-action" onClick="confirmed()">YES</button>')).add($('<button class="btn-flat toast-action" onClick="dismissed()">No</button>'))
  Materialize.toast($toastContent)
}

function dismissed() {
  elem = null
  Materialize.Toast.removeAll()
}
let publishCheckHandler = function() {


  if (this.checked) {
    // Checkbox is checked..
    sendAjax(this, 'publish', true)
    console.log('checked')
  } else {
    // Checkbox is not checked..
    sendAjax(this, 'publish', false)
    console.log('not checked')

  }
}

let draftCheckHandler = function(event) {
  if (this.checked) {
    // Checkbox is checked..
    sendAjax(this, 'draft', true)
    console.log('checked')
  } else {
    // Checkbox is not checked..
    sendAjax(this, 'draft', false)
    console.log('not checked')

  }
}
let sendAjax = (currElement, mode, check) => {
  $tr = $(currElement).parent().parent().parent().parent()
  console.log('tra', $tr)
  let blogTitle = $tr.attr('id')

  $.ajax({
    url: `/admin/blog/editmode/${blogTitle}/${mode}/${check}`,
    method: 'POST',
    success: function(result) {
      Materialize.toast($(`<span>${mode} Mode Changed</span>`), 2000)
      $('.toast').css('background-color', '#13b3b8')
    },
    error: function(result) {
      Materialize.toast($(`<span>Failure to update ${mode}</span>`), 2000)
      $('.toast').css('background-color', '#f44336')
      $(currElement).prop('checked', !check)
    }
  })
}

let publishLever = $('.publish-lever'),
  draftLever = $('.draft-lever')
publishLever.on('change', publishCheckHandler)
draftLever.on('change', draftCheckHandler)

function confirmed() {
  $tr = $(elem).parent().parent()
  let blogTitle = $tr.attr('id')
  $tr.fadeOut(1000, () => {
    $tr.remove()
  })

  $.ajax({
    url: `/admin/blog/delete/${blogTitle}`,
    method: 'DELETE',
    success: function(result) {
      Materialize.toast($('<span>Post Deleted</span>'), 4000)
      $('.toast').css('background-color', '#f44336')
    }
  })
  Materialize.Toast.removeAll()
}
