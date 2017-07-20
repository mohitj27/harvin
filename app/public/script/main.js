/* 
    Text fields 
*/
$(function(){
    
	$(document).on('focus', 'div.myInput div.form-group-options:last-child div.input-group-option input', function(){
		console.log("focused");
		var sInputGroupHtml = $(this).parent().html();
		var sInputGroupClasses = $(this).parent().attr('class');
		var sFormGroupHtml = $(this).parent().parent().html();
		var sFormGroupClasses = $(this).parent().parent().attr('class');
		$(this).parent().parent().parent().append('<div class="'+sFormGroupClasses+'">'+sFormGroupHtml+'</div>');
        
	});
	
	
	$(document).on('click', 'div.form-group-options .input-group-addon-remove', function(){
        
		$(this).parent().parent().remove();
        
	});

	//
	console.log("main function");
	var content = "<input type=text onKeyDown='event.stopPropagation();' onKeyPress='addSelectInpKeyPress(this,event)' onClick='event.stopPropagation()' placeholder='Add item'> <span class='glyphicon glyphicon-plus addnewicon' onClick='addSelectItem(this,event,1);'></span>";
 
  var divider = $('<option/>')
          .addClass('divider')
          .data('divider', true);
          
 
  var addoption = $('<option/>')
          .addClass('additem')
          .data('content', content)
      
  $('.selectpicker')
          .append(divider)
          .append(addoption)
          .selectpicker();
    
});
// 

function addSelectItem(t,ev)
{
	console.log("add selectedItem");
   ev.stopPropagation();
 
   var txt=$(t).prev().val().replace(/[|]/g,"");
   if ($.trim(txt)=='') return;
   var p=$(t).closest('.bootstrap-select').prev();
   var o=$('option', p).eq(-2);
   o.before( $("<option>", { "selected": true, "text": txt}) );
   p.selectpicker('refresh');
}
 
function addSelectInpKeyPress(t,ev)
{
	console.log("add selectedkeyIput");
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




