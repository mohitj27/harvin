$(function() {
        var content = "<input type=text onKeyDown='event.stopPropagation();' onKeyPress='addSelectInpKeyPress(this,event)' onClick='event.stopPropagation()' placeholder='Add item'> <span class='glyphicon glyphicon-plus addnewicon' onClick='addSelectItem(this,event,1);'></span>";

        var divider = $('<option/>')
                .addClass('divider lastTwo')
                .data('divider', true);
                

        var addoption = $('<option/>')
          .addClass('additem lastTwo')
          .data('content', content)

	//appending divider and add item element	  
        $('.selectpicker')
          .append(divider)
          .append(addoption)
          .selectpicker();

        //removing add item from #subjectInBatch        
        $("#subjectsInBatch").children().last().remove();        
        $(".selectpicker").selectpicker("refresh");
        
        //populating subject option after class has been chosen
        $('#classs').on('change', function() {
                var $subject = $("#subject");
                var o = $("option", $subject).eq(-2);
                $subject.children().not(".lastTwo").not(":first").remove();
                $.get("/class/"+this.value, function(res){
                        $(".selectpicker").selectpicker("refresh");
                        
                                console.log(res.classs)
                        if(res.classs){
                                var length = res.classs.subjects.length
                                if(length>0){
                                        console.log(length)
                                        for(var i = 0; i < length;i++){
                                                o.before( $("<option>", { "text": res.classs.subjects[i].subjectName, "val":res.classs.subjects[i].subjectName}) );
                                                
                                        }
                                        $(".selectpicker").selectpicker("refresh");
                                }
                        }

                });
        });

        //populating chapter option after subject has been chosen
        $('#subject').on('change', function() {
        var $chapter = $("#chapter");
        var o = $("option", $chapter).eq(-2);
        $chapter.children().not(".lastTwo").not(":first").remove();
                $.get("/subject/"+this.value, function(res){
                        $(".selectpicker").selectpicker("refresh");
                        
                        if(res.subject){
                                var length = res.subject.chapters.length
                                if(length>0){
                                        for(var i = 0; i < length;i++){
                                                o.before( $("<option>", { "text": res.subject.chapters[i].chapterName, "val":res.subject.chapters[i].chapterName}) );
                                                
                                        }
                                        $(".selectpicker").selectpicker("refresh");
                                }
                        }

                });
                
        });        

        //populating topic option after chapter has been chosen
        $('#chapter').on('change', function() {
                var $topic = $("#topic");
                var o = $("option", $topic).eq(-2);
                $topic.children().not(".lastTwo").not(":first").remove();
                $.get("/chapter/"+this.value, function(res){
                        $(".selectpicker").selectpicker("refresh");
                        
                        if(res.chapter){
                                var length = res.chapter.topics.length
                                if(length>0){
                                        for(var i = 0; i < length;i++){
                                                o.before( $("<option>", { "text": res.chapter.topics[i].topicName, "val":res.chapter.topics[i].topicName}) );
                                                
                                        }
                                        $(".selectpicker").selectpicker("refresh");
                                }
                        }

                });
        });

        
        //selecting the subject available in particular batch
        $('#batch').on('change', function() {
                var $subjectsInBatch = $("#subjectsInBatch");
                var o = $("option", $subjectsInBatch).not(".lastTwo");
                $.get("/batches/"+this.value, function(res){
                        o.each(function(index){
                                console.log(index)
                                this.selected=false;
                        })
                        $(".selectpicker").selectpicker("refresh");
                        if(res.batch){
                                var length = res.batch.subject.length
                                if(length>0){
                                        for(var i = 0; i< length; i++){
                                                o.each(function(j){
                                                        if(j>0)
                                                        {
                                                                if(this.value==res.batch.subject[i].subjectName)
                                                                        this.selected = true;
                                                        }
                                                })
                                        }
                                }
                                $(".selectpicker").selectpicker("refresh");
                        
                        }
                });
        });

        //retrieve collection name from button and populate document column
        $(".collection").click(function(event){
                var collectionName = this.value;
                $.get("/db/collections/"+this.value, function(res){
                        $documents = $("#documents");
                        $documents.children().remove();
                        if(res.objects.length>0){
                                res.objects.forEach(function(object) {
                                        $button = $("<button>", {"class":"btn btn-large btn-default objectButton document", "text":object._id})
                                        $documents.append($button);
                                }, this);
                        }
                });

                
        });
});

function addSelectItem(t,ev)
{

   ev.stopPropagation();

   var txt=$(t).prev().val().replace(/[|]/g,"");
   if ($.trim(txt)=='') return;
   var p=$(t).closest(".dropdown-menu.open").next();

   var o=$('option',p).eq(-2);

   o.before( $("<option>", { "selected": false, "text": txt, "val":txt}) );
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
