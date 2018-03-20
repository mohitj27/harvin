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

  $('#chapterName').on('focusout', function (e) {
    emptyInputField('#topicName')
    onChapterSelect()
  })

  function onChapterSelect (selectedChapterName) {
    let chapterName = selectedChapterName || $('#chapterName').val()
    if (chapterName.length > 0) {
      $.get('/admin/chapters/' + chapterName, function (res) {
        topics = {}
        if (res.chapter) {
          res.chapter.topics.forEach((topic) => {
            topics[topic.topicName] = null
          })

          $('#chapterDescription').val(res.chapter.chapterDescription)
          $('#chapterDescription').trigger('autoresize')
        }

        $('#topicName').autocomplete({
          data: topics,
          onAutocomplete: onTopicChange
        })
      })
    }
  }

  function onTopicChange (selectedTopicName) {
    let topicName = selectedTopicName || $('#chapterName').val()
    if (topicName.length > 0) {
      $.get('/admin/topics/' + topicName, function (res) {
        if (res.topic) {
          $('#topicDescription').val(res.topic.topicDescription)
          $('#topicDescription').trigger('autoresize')
        }
      })
    }
  }

  function onSubjectSelect (selectedSubjectName) {
    //     onAutocomplete: onSubjectSelect
    let className = $('#className').val()
    let subjectName = selectedSubjectName || $('#subjectName').val()
    if (subjectName.length > 0 && className.length > 0) {
      $.get('/admin/subjects/' + subjectName + '?className=' + className, function (res) {
        chapters = {}

        if (res.subject) {
          res.subject.chapters.forEach((chapter) => {
            chapters[chapter.chapterName] = null
          })
        }
        $('#chapterName').autocomplete({
          data: chapters,
          onAutocomplete: onChapterSelect
        })
      })
    }
  }

  function onClassSelect (selectedClassName) {
    let className = selectedClassName || $('#className').val()
    if (className.length > 0) {
      $.get('/admin/classes/' + className, function (res) {
        subjects = {}
        if (res.classs) {
          res.classs.subjects.forEach((subject) => {
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

  $.get('/admin/classes', function (res) {
    classes = {}

    if (res.classes) {
      res.classes.forEach((classs) => {
        classes[classs.className] = null
      })
    }

    $('#className').autocomplete({
      data: classes,
      onAutocomplete: onClassSelect
    })
  })
})
