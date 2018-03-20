$(()=>{

  var clipboard = new ClipboardJS('.clipboard');


  clipboard.on('success', function(e) {
      new Materialize.Toast('<span>Link Copied<span>',1000)
  });

  clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
  });


})

let elem

function confirmDelete(currElement) {
  dismissed()
  elem = currElement
  var $toastContent = $('<span>Are you sure you want to Delete this Link?</span>').add($('<button class="btn-flat toast-action" onClick="confirmed()">YES</button>')).add($('<button class="btn-flat toast-action" onClick="dismissed()">No</button>'))
  Materialize.toast($toastContent)
}

function dismissed() {
  elem = null
  Materialize.Toast.removeAll()
}

function confirmed() {
  $tr = $(elem).parent().parent()
  let linkTitle = $tr.attr('id')
  $tr.fadeOut(1000, () => {
    $tr.remove()
  })


  $.ajax({
    url: `/admin/files/deletelink/${linkTitle}`,
    method: 'DELETE',
    success: function(result) {
      Materialize.toast($('<span>Link Deleted</span>'), 4000)
      $('.toast').css('background-color', '#f44336')
    }
  })
  Materialize.Toast.removeAll()
}
