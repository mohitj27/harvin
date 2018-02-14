$(function () {

        function emptyInputField(toEmpty){
          $(toEmpty).val('')
          $(toEmpty).autocomplete({
         	    data: {},
         	    onAutocomplete: onSubjectSelect
       	  });
        }

        $('#className').on('focusout', function (e) {
          emptyInputField('#subjectName')
          onClassSelect()
        })

        $('#subjectName').on('focusout', function (e) {
          emptyInputField('#chapterName')
          onSubjectSelect()
        })


        function onSubjectSelect(selectedSubjectName) {
         	//     onAutocomplete: onSubjectSelect
          let className = $('#className').val()
          let subjectName = selectedSubjectName || $('#subjectName').val()
          if(subjectName.length > 0 && className.length > 0){
            $.get('/admin/questionBank/class/' + className + '/subject/' + subjectName, function (res) {

             	chapters = {};

             	if(res.subject){
                res.subject.chapters.forEach((chapter) => {
               		chapters[chapter.chapterName] = null
               	})
              }

             	$('#chapterName').autocomplete({
             	    data: chapters
           	  });
         	  });
          }
        }

        function onClassSelect(selectedClassName) {
          let className = selectedClassName || $('#className').val()
          if(className.length > 0 ){
            $.get('/admin/questionBank/class/' + className, function (res) {

             	subjects = {};
             	if(res.classs){
                res.classs.subjects.forEach((subject) => {
               		subjects[subject.subjectName] = null
               	})
              }

             	$('#subjectName').autocomplete({
             	    data: subjects,
             	    onAutocomplete: onSubjectSelect
           	  });
         	  });
          }
        }

        $.get('/admin/questionBank/classes', function (res) {

         	classes = {};

         	if(res.classes){
            res.classes.forEach((classs) => {
           		classes[classs.className] = null
           	})
          }

         	$('#className').autocomplete({
         	    data: classes,
         	    onAutocomplete: onClassSelect
         	  });
         })
      })
