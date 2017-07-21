$(function() {
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

          $('#subject').on('change', function() {
                console.log( "subject: "+this.value );
                $.get("/admin/subject/"+this.value, function(res){
                        var length = res.subject.chapters.length
                        console.log(length);
                        var $chapter = $("#chapter");
                        // console.log($chapter)
                        $chapter.empty();
                        for(var i = 0; i < length;i++){
                                console.log("setting chapter")
                                $chapter.append('<option value=' + res.subject.chapters[i].chapterName + '>' + res.subject.chapters[i].chapterName + '</option>');
                        }

                });
                 $(".selectpicker").selectpicker("refresh");
                
        });

        $('#chapter').on('change', function() {
                console.log( "chapter: "+this.value );
                // $("#topic").val('');
                // $(".selectpicker").selectpicker("refresh");
        });

        $('#topic').on('change', function() {
                console.log( "topic: "+this.value );
        });



});

function addSelectItem(t,ev)
{

   ev.stopPropagation();

   var txt=$(t).prev().val().replace(/[|]/g,"");
   if ($.trim(txt)=='') return;
   var p=$(t).closest(".dropdown-menu.open").next();

   var o=$('option',p).eq(-2);

   o.before( $("<option>", { "selected": true, "text": txt, "val":txt}) );
   p.selectpicker('refresh');
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

function reset(t, ev){

        console.log(t);
        console.log(ev);
}