/* 
    Text fields 
*/
$(function(){
    
	$(document).on('focus', 'div.form-group-options div.input-group-option:last-child input', function(){
        
		var sInputGroupHtml = $(this).parent().html();
		var sInputGroupClasses = $(this).parent().attr('class');
		var sFormGroupHtml = $(this).parent().parent().html();
		var sFormGroupClasses = $(this).parent().parent().attr('class');
		$(this).parent().parent().parent().append('<div class="'+sFormGroupClasses+'">'+sFormGroupHtml+'</div>');
        
	});
	
	$(document).on('click', 'div.form-group-options .input-group-addon-remove', function(){
        
		$(this).parent().remove();
        
	});
    
});

