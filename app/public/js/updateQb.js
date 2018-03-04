const fillSubjects = function (subjects) {
  $('#updateSubjectSelect').children().not(':first').remove()
  for (let sub of subjects) {
    $('#updateSubjectSelect').append($('<option>', {
      text: sub.subjectName,
      value: sub._id
    }))
  }
  $('#updateSubjectSelect').val($('#updateSubjectSelect').children().eq(0).val())
  $('#updateSubjectClassSelect').val($('#updateSubjectClassSelect').children().eq(0).val())
  $('select').material_select()
}

const fillChapters = function (chapters) {
  $('#updateChapterSelect').children().not(':first').remove()
  for (let chap of chapters) {
    $('#updateSubjectSelect').append($('<option>', {
      text: chap.chapterName,
      value: chap._id
    }))
  }
  $('#updateChapterSelect').val($('#updateChapterSelect').children().eq(0).val())
  $('#updateChapterSubjectSelect').val($('#updateChapterClassSelect').children().eq(0).val())
  $('select').material_select()
}

const fillClasses = function (classes) {
  $('#updateSubjectClassSelect').children().not(':first').remove()
  for (let classs of classes) {
    $('#updateSubjectClassSelect').append($('<option>', {
      text: classs.className,
      value: classs._id
    }))
    $('select').material_select()
  }
}

const selectClassOfSubject = function (classs, classes) {
  let i = _.findIndex(classes, ['_id', classs._id])
  $('#updateSubjectClassSelect').children().eq(i + 1).attr('selected', true)
  $('select').material_select()
}

$(function () {
  $('select').material_select()

  $('#updateSubject').on('click', function () {
    let subId = $('#updateSubjectSelect option:selected').val()
    let classId = $('#updateSubjectClassSelect option:selected').val()
    if (subId !== '' && classId !== '') {
      $.ajax({
        url: '/admin/questionBank/update',
        method: 'post',
        data: {
          subId,
          chapterId: null,
          classId,
          toUpdate: 'subject'
        },
        success: function (response) {
          Materialize.toast($('<span>Successfully updated the subject</span>'), 4000)
          $('.toast:last').css('background-color', '#13b38b')
        },
        error: function (error) {
          if (error) {
            Materialize.toast($('<span>' + error.responseText + '</span>'), 4000)
            $('.toast:last').css('background-color', '#f44336')
          }
        }
      })
    }
  })
  $('#updateSubjectSelect').on('change', function (e) {
    if ($(this).val() !== '') {
      $.ajax({
        url: '/admin/questionBank/subjectId/' + $(this).val(),
        method: 'get',
        success: function (response) {
          fillClasses(response.classes)
          selectClassOfSubject(response.classs, response.classes)
        },
        error: function (error) {}
      })
    }
  })
  if ($('.modal').length > 0) {
    $('#updateSubject').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $.ajax({
          url: '/admin/questionBank/subjects',
          method: 'get',
          success: function (response) {
            fillSubjects(response.subjects)
          },
          error: function (error) {
            if (error) {
              Materialize.toast($('<span>' + error.responseText + '</span>'), 4000)
              $('.toast:last').css('background-color', '#f44336')
            }
          }
        })
      },
      complete: function () {} // Callback for Modal close
    })

    $('#updateChapter').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $.ajax({
          url: '/admin/questionBank/chapters',
          method: 'get',
          success: function (response) {
            fillChapters(response.chapters)
          },
          error: function (error) {
            if (error) {
              Materialize.toast($('<span>' + error.responseText + '</span>'), 4000)
              $('.toast:last').css('background-color', '#f44336')
            }
          }
        })
      },
      complete: function () {} // Callback for Modal close
    })
  }
})
