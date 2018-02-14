$(function(){


})
let elem
function confirmDelete(currElement){
elem=currElement
    var $toastContent = $('<span>Are you sure you want to Delete this POST?</span>').add($('<button class="btn-flat toast-action" onClick="confirmed()">YES</button>')).add($('<button class="btn-flat toast-action" onClick="dismissed()">No</button>'));
    Materialize.toast($toastContent);
}
function dismissed(){

Materialize.Toast.removeAll()
}
function confirmed(){
  $tr=$(elem).parent().parent()
  let blogname=$tr.attr('id')
  $tr.fadeOut(1000,()=>{$tr.remove()})

  $.ajax({
      url: `/admin/blog/delete/${blogname}`,
      method:'DELETE',
      success: function(result) {
        Materialize.toast( $('<span>Post Deleted</span>'), 4000);
        $('.toast').css('background-color', '#f44336')

      }
  });
Materialize.Toast.removeAll();
}
