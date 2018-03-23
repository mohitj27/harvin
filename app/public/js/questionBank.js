$(function () {
  function emptyInputField (toEmpty) {
    $(toEmpty).val('')
    $(toEmpty).autocomplete({
      data: {},
      onAutocomplete: onSubjectSelect
    })
  }

  $('#className').on('focusout', function (e) {
    emptyInputField('#subjectName')
    onClassSelect()
  })

  $('#subjectName').on('focusout', function (e) {
    emptyInputField('#chapterName')
    onSubjectSelect()
  })

  function onSubjectSelect (selectedSubjectName) {
    //     onAutocomplete: onSubjectSelect
    let className = $('#className').val()
    let subjectName = selectedSubjectName || $('#subjectName').val()
    if (subjectName.length > 0 && className.length > 0) {
      $.get(
        '/admin/questionBank/subject/' +
          subjectName +
          '?className=' +
          className,
        function (res) {
          let chapters = {}

          if (res.subject) {
            res.subject.chapters.forEach(chapter => {
              chapters[chapter.chapterName] = null
            })
          }

          $('#chapterName').autocomplete({
            data: chapters
          })
        }
      )
    }
  }

  function onClassSelect (selectedClassName) {
    let className = selectedClassName || $('#className').val()
    if (className.length > 0) {
      $.get('/admin/questionBank/class/' + className, function (res) {
        let subjects = {}
        if (res.classs) {
          res.classs.subjects.forEach(subject => {
            subjects[subject.subjectName] = null
          })
        }

        $('#subjectName').autocomplete({
          data: subjects,
          onAutocomplete: onSubjectSelect
        })
      })
    }
  }

  $.get('/admin/questionBank/classes', function (res) {
    let classes = {}

    if (res.classes) {
      res.classes.forEach(classs => {
        classes[classs.className] = null
      })
    }

    $('#className').autocomplete({
      data: classes,
      onAutocomplete: onClassSelect
    })
  })

  var next = 1
  $('#field').on('click', '.add-more', function (e) {
    var addto = '#field' + next
    var addRemove = '#field' + next
    next = next + 1
    var newIn =
      '<input name="options" autocomplete="off" class="input opt" id="field' +
      next +
      '" type="text">'
    var newInput = $(newIn)
    var removeBtn =
      '<button id="remove' +
      (next - 1) +
      '" class="btn red remove-me" >-</button>'
    var removeButton = $(removeBtn)
    // console.log('ad to ', addto)
    // console.log('remove ', addRemove)
    $(addto).after(newInput)
    $(addRemove).after(removeButton)
    refreshAns()

    // remove option click handler
    $('#field').on('click', '.remove-me', function (e) {
      // console.log('remove', e)
      var fieldNum = this.id.charAt(this.id.length - 1)
      var fieldID = '#field' + fieldNum
      $(this).remove()
      $(fieldID).remove()
      refreshAns()
    })
  })

  $('#addNewQuestion').on('keyup', "input[name='options']", function () {
    refreshAns()
  })

  $('#submitQuesBtn').on('click', function (e) {
    e.preventDefault()
    $('#submitQuesBtn').prop('disabled', true)
    const className = $('#className').val()
    const subjectName = $('#subjectName').val()
    const chapterName = $('#chapterName').val()
    const question = $('#question').val()
    const option = []
    $("input[name='options']").each(function () {
      option.push($(this).val())
    })
    const answer = []
    $("input[name='answer']:checked").each(function () {
      answer.push($(this).val())
    })
    const newQues = {
      className,
      subjectName,
      chapterName,
      question,
      option,
      answer
    }

    $.ajax({
      url: '/admin/questionBank',
      method: 'post',
      data: newQues,
      error: function (error) {
        if (error) {
          Materialize.toast($('<span>' + error.responseText + '</span>'), 4000)
          $('.toast:last').css('background-color', '#f44336')
        }
      },
      success: function (res) {
        Materialize.toast($('<span>Question added Successfully</span>'), 4000)
        $('.toast:last').css('background-color', '#13b38b')

        // clear inputs
        $('#question').val('')
        $('#field')
          .children()
          .remove()
        const newIn =
          '<input required name="options" autocomplete="off" class="input opt quesOptions" id="field1" type="text" />'
        const addBtn =
          '<button id="b1" class="btn add-more" type="button">+</button>'
        $('#field').append(newIn)
        $('#field').append(addBtn)
        next = 1
        $('#answers')
          .children()
          .remove()
      },
      complete: function () {
        $('#submitQuesBtn').prop('disabled', false)
      }
    })
  })
})

function refreshAns () {
  var options = []

  // selecting the not empty input
  $opt = $('#addNewQuestion input[type=text]').filter(function (index) {
    if (this.value.length > 0) {
      return $(this).val()
    }
  })

  // setting up options string
  for (var i = 0; i < $opt.length; i++) {
    options.push($opt[i].value)
  }

  // setting up the ans radio checkbox
  $answerCheckbox = $('#answers')
  $answerCheckbox.children().remove()
  for (var j = 0; j < options.length; j++) {
    var opt = options[j].replace(/"/g, '&quot;')
    opt = opt.replace(/'/g, '&apos;')
    var cbox =
      '<div class="wrapAns"><p><input class="answer" type="checkbox" id="answ' +
      j +
      '" name ="answer" value="' +
      opt +
      '"><label for="answ' +
      j +
      '">' +
      options[j] +
      '</label></p></div><br>'
    $answerCheckbox.append(cbox)
  }
}
