$(function(){
  $('#qb_classs').on('change', function() {
    var $subject = $("#qb_subject");
    var $sub_options = $subject.children();
    $sub_options.remove()
    $.get("/admin/questionBank/class/" + this.value, function(res) {

      if (res.classs) {
        $subject.append($("<option>", {
          "text": "Subject",
          "val": "",
          "selected": true,
          "disabled": true
        }));
        var length = res.classs.subjects.length;
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            $subject.append($("<option>", {
              "text": res.classs.subjects[i].subjectName,
              "val": res.classs.subjects[i].subjectName
            }));
          }
        }
      }

    $('select').material_select();
    });
  });

  //populating chapter option after subject has been chosen
  $('#qb_subject').on('change', function() {
    var className = $("#qb_classs option:selected").val();
    var $chapter = $("#qb_chapter");
    var $chap_options = $chapter.children()
    $chap_options.remove();
    $.get("/admin/questionBank/class/" + className + "/subject/" + this.value, function(res) {

      if (res.subject) {
        console.log('res', res.subject);
        $chapter.append($("<option>", {
          "text": "Chapter",
          "val": "",
          "selected": true,
          "disabled": true
        }));
        var length = res.subject.chapters.length;
        // console.log('len', length);
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            $chapter.append($("<option>", {
              "text": res.subject.chapters[i].chapterName,
              "val": res.subject.chapters[i].chapterName
            }));
          }
        }
      }
      $('select').material_select();

    });
  });

  $('.question-delete-button').on('click', function(e){
    e.preventDefault()
    $currentQues = $(this).parent().parent()

    let url = $(this).attr('href')
    $.post(url, function(res){
      if(!res.msg)
        res.msg = res
        let $toastContent;
      if(res.success){
        $toastContent = $('<span>'+res.msg+'</span>', {class: 'success-toast'})
        Materialize.toast($toastContent, 50000);
        $('.toast').css('background-color', 'green')
        $currentQues.fadeOut('fast', 'linear', function() {
          $currentQues.remove()
        })

      }else{
        $toastContent = $('<span>'+res.msg+'</span>', {class: 'error-toast'})
        Materialize.toast($toastContent, 50000);
        $('.toast').css('background-color', 'red')
      }
    })
  })

})
