/* 
    Text fields 
*/
$(function(){
    
	$(document).on('focus', '.newSubjectInput:last-child ', function(){
        
		var sInputGroupHtml = $(this).parent().html();
		var sInputGroupClasses = $(this).parent().attr('class');
		$(this).parent().parent().append('<div class="'+sInputGroupClasses+'">'+sInputGroupHtml+'</div>');
        
	});
	
	$(document).on('click', 'div.form-group-options .input-group-addon-remove', function(){
        
		$(this).parent().remove();
        
	});
    
});

/* 
    Selects 
*/
$(function(){
        
	var values = new Array();
	
	$(document).on('change', '.form-group-multiple-selects .input-group-multiple-select:last-child select', function(){
        
		var selectsLength = $(this).parent().parent().find('.input-group-multiple-select select').length;
		var optionsLength = ($(this).find('option').length)-1;
		
		if(selectsLength < optionsLength){
			var sInputGroupHtml = $(this).parent().html();
			var sInputGroupClasses = $(this).parent().attr('class');
			$(this).parent().parent().append('<div class="'+sInputGroupClasses+'">'+sInputGroupHtml+'</div>');	
		}
		
		updateValues($(this).parent().parent());
		
	});
	
	$(document).on('change', '.form-group-multiple-selects .input-group-multiple-select:not(:last-child) select', function(){
		
		updateValues($(this).parent().parent());
		
	});
	
	$(document).on('click', '.input-group-addon-remove', function(){
        
        var oSelectContainer = $(this).parent().parent()
    	$(this).parent().remove();
		updateValues(oSelectContainer);
        
	});
	
	function updateValues(oSelectContainer){
        
		values = new Array();
		$(oSelectContainer).find('.input-group-multiple-select select').each(function(){
			var value = $(this).val();
			if(value != 0 && value != ""){
				values.push(value);
			}
		});
		
		$(oSelectContainer).find('.input-group-multiple-select select').find('option').each(function(){
			var optionValue = $(this).val();
			var selectValue = $(this).parent().val();
			if(in_array(optionValue,values)!= -1 && selectValue != optionValue)
			{
				$(this).attr('disabled', 'disabled');
			}
			else
			{
				$(this).removeAttr('disabled');
			}
		});
        
	}
	
	function in_array(needle, haystack){
        
		var found = 0;
		for (var i=0, length=haystack.length;i<length;i++) {
			if (haystack[i] == needle) return i;
			found++;
	    }
	    return -1;
        
	}
    
    // Update all options for first use
    $('.form-group-multiple-selects').each(function(i, e){
        
    	updateValues(e);
        
	});
});