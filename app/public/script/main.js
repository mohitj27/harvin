$(function() {
  var content = "<input type=text onKeyDown='event.stopPropagation();' onKeyPress='addSelectInpKeyPress(this,event)' onClick='event.stopPropagation()' placeholder='Add item'> <span class='glyphicon glyphicon-plus addnewicon' onClick='addSelectItem(this,event,1);'></span>";
 
  var divider = $('<option/>')
          .addClass('divider')
          .data('divider', true);
          
 
  var addoption = $('<option/>')
          .addClass('additem')
          .data('content', content)
      
  $('#add').hide()
          
          .append(addoption)
          .append(divider)
          .selectpicker();
 
});
 
function addSelectItem(t,ev)
{
   ev.stopPropagation();
   var txt=$(t).prev().val().replace(/[|]/g,"");
   if ($.trim(txt)=='') return;
    var select = document.getElementById("select1");
    var opt = document.createElement("option");
    opt.value = txt;
    opt.text=txt;
    opt.selected= true;

    select.appendChild(opt);
    $(".selectpicker").selectpicker('refresh');

}
 
function addSelectInpKeyPress(t,ev)
{
   ev.stopPropagation();
 
   // do not allow pipe character
   if (ev.which==124) ev.preventDefault();
 
   // enter character adds the option
   if (ev.which==13)
   {
      ev.preventDefault();
      addSelectItem($(t).next(),ev);
   }
}