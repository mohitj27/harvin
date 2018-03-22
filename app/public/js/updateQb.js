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
    $('#updateChapterSelect').append($('<option>', {
      text: chap.chapterName,
      value: chap._id
    }))
  }
  $('#updateChapterSelect').val($('#updateChapterSelect').children().eq(0).val())
  $('#updateChapterSubjectSelect').val($('#updateChapterSubjectSelect').children().eq(0).val())
  $('select').material_select()
}

const fillClasses = function (classes) {
  $('#updateClassSelect').children().not(':first').remove()
  for (let classs of classes) {
    $('#updateClassSelect').append($('<option>', {
      text: classs.className,
      value: classs._id
    }))
  }
  $('#updateClassSelect').val($('#updateClassSelect').children().eq(0).val())
  $('#updateClassSubjectsSelect').val($('#updateClassSubjectsSelect').children().eq(0).val())
  $('select').material_select()
}

const fillClassesForSubjectUpdate = function (classes) {
  $('#updateSubjectClassSelect').children().not(':first').remove()
  for (let classs of classes) {
    $('#updateSubjectClassSelect').append($('<option>', {
      text: classs.className,
      value: classs._id
    }))
    $('select').material_select()
  }
}

const fillSubjectsForChapterUpdate = function (subjects) {
  $('#updateChapterSubjectSelect').children().not(':first').remove()
  for (let subject of subjects) {
    $('#updateChapterSubjectSelect').append($('<option>', {
      text: subject.subjectName,
      value: subject._id
    }))
    $('select').material_select()
  }
}

const fillSubjectsForClassUpdate = function (allSubjects) {
  $('#updateClassSubjectsSelect').children().not(':first').remove()
  for (let subject of allSubjects) {
    $('#updateClassSubjectsSelect').append($('<option>', {
      text: subject.subjectName,
      value: subject._id
    }))
    $('select').material_select()
  }
}

const selectClassOfSubject = function (classs, classes) {
  let i = _.findIndex(classes, ['_id', classs._id])
  $('#updateSubjectClassSelect').children().eq(i + 1).attr('selected', true)
  $('select').material_select()
}

const selectSubjectOfChapter = function (subject, subjects) {
  let i = _.findIndex(subjects, ['_id', subject._id])
  $('#updateChapterSubjectSelect').children().eq(i + 1).attr('selected', true)
  $('select').material_select()
}

const selectSubjectsOfClass = function (subjects, allSubjects) {
  let indexes = []
  for (let sub of subjects) {
    indexes.push(_.findIndex(allSubjects, ['_id', sub._id]))
  }
  indexes.forEach(i => $('#updateClassSubjectsSelect').children().eq(i + 1).attr('selected', true))

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

  $('#updateChapter').on('click', function () {
    let chapterId = $('#updateChapterSelect option:selected').val()
    let subId = $('#updateChapterSubjectSelect option:selected').val()
    if (chapterId !== '' && subId !== '') {
      $.ajax({
        url: '/admin/questionBank/update',
        method: 'post',
        data: {
          subId,
          chapterId,
          classId: null,
          toUpdate: 'chapter'
        },
        success: function (response) {
          Materialize.toast($('<span>Successfully updated the chapter</span>'), 4000)
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

  $('#updateSubjectClassSelect').on('change', function (e) {
    if ($(this).val() !== '') {
      $('#updateSubjectNewClassSpan').prop('hidden', false)
      $('#updateSubjectNewClass').text($('#updateSubjectClassSelect option:selected').text())
    }
  })

  $('#updateChapterSubjectSelect').on('change', function (e) {
    if ($(this).val() !== '') {
      $('#updateChapterNewSubjectSpan').prop('hidden', false)
      $('#updateChapterNewSubject').text($('#updateChapterSubjectSelect option:selected').text())
    }
  })

  $('#updateSubjectSelect').on('change', function (e) {
    if ($(this).val() !== '') {
      $('#updateSubjectSelectedSubjectSpan').prop('hidden', false)
      $('#updateSubjectSubjectName').text($('#updateSubjectSelect option:selected').text())

      $.ajax({
        url: '/admin/questionBank/subjectId/' + $(this).val(),
        method: 'get',
        success: function (response) {
          fillClassesForSubjectUpdate(response.classes)
          selectClassOfSubject(response.classs, response.classes)
          $('#updateSubjectCurrentClassSpan').prop('hidden', false)
          $('#updateSubjectCurrentClass').text($('#updateSubjectClassSelect option:selected').text())
        },
        error: function (error) {}
      })
    }
  })

  $('#updateChapterSelect').on('change', function (e) {
    if ($(this).val() !== '') {
      $('#updateChapterSelectedChapterSpan').prop('hidden', false)
      $('#updateChapterChapterName').text($('#updateChapterSelect option:selected').text())

      $.ajax({
        url: '/admin/questionBank/chapterId/' + $(this).val(),
        method: 'get',
        success: function (response) {
          fillSubjectsForChapterUpdate(response.subjects)
          selectSubjectOfChapter(response.subject, response.subjects)
          $('#updateChapterCurrentSubjectSpan').prop('hidden', false)
          $('#updateChapterCurrentSubject').text($('#updateChapterSubjectSelect option:selected').text())
        },
        error: function (error) {}
      })
    }
  })

  $('#updateClassSelect').on('change', function (e) {
    if ($(this).val() !== '') {
      $.ajax({
        url: '/admin/questionBank/classId/' + $(this).val(),
        method: 'get',
        success: function (response) {
          // console.log('res', response)
          fillSubjectsForClassUpdate(response.allSubjects)
          selectSubjectsOfClass(response.subjects, response.allSubjects)
        },
        error: function (error) {}
      })
    }
  })

  if ($('.modal').length > 0) {
    $('#updateSubjectModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $('#updateSubjectSelectedSubjectSpan').prop('hidden', true)
        $('#updateSubjectCurrentClassSpan').prop('hidden', true)
        $('#updateSubjectNewClassSpan').prop('hidden', true)
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

    $('#updateChapterModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $('#updateChapterSelectedChapterSpan').prop('hidden', true)
        $('#updateChapterCurrentSubjectSpan').prop('hidden', true)
        $('#updateChapterNewSubjectSpan').prop('hidden', true)

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

    $('#updateClassModal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        $.ajax({
          url: '/admin/questionBank/classes',
          method: 'get',
          success: function (response) {
            fillClasses(response.classes)
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
