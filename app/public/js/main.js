$(function() {

//For error and success toasts notification
	$errorCard = $('#error-card');
	$successCard= $('#success-card');
	 $('.modal').modal();

	$('.modal-trigger').on('click', function () {
		// console.log('text', $(this).children('.comment-modal-trigger').text());
		$modalContent = $('.modal-content')
		$modalContent.children().remove()
		$modalContent.append($('<h3>', {text: 'Visitor info'}))
		$modalContent.append($('<p>', {text: 'Comments: ' + $(this).children('#comments').text()}))
		$modalContent.append($('<p>', {text: 'School: ' + $(this).children('#school').text()}))
		$modalContent.append($('<p>', {text: 'Aim: ' + $(this).children('#aim').text()}))
		$modalContent.append($('<p>', {text: 'Address: ' + $(this).children('#address').text()}))
	})

  if ($errorCard.length > 0) {
		 Materialize.toast($errorCard.text(), 5000)
		 $('.toast').css('background-color', 'red')
  }

  if ($successCard.length > 0) {
		 Materialize.toast($successCard.text(), 5000)
		 $('.toast').css('background-color', 'green')
  }

  $('select').material_select();

  //summernote init
  if ($('#summernote').length !== 0) {
    $('#summernote').summernote({
      placeholder: 'Write your content here!!!',
      tabsize: 2,
      minHeight: 500,
      maxHeight: null,
      focus: true
    });
  }

  //Date picker initialization
  if ($('.datepicker').length !== 0) {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: true // Close upon selecting a date,
    });
  }

  ///NAVBAR INIT
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,
    onOpen: function(el) {
      $('body').css('padding-left', '300px')
      $('footer').css('padding-left', '300px')
      $('#sidenav-overlay').remove()
      $('.drag-target').remove()
			$('body').css('overflow-y', 'scroll')
			// $('body').css('overflow-y', 'scroll')
    },
    onClose: function(el) {
      $('body').css('padding-left', '0')
      $('footer').css('padding-left', '0')
    }
  });

  $('.collapsible').collapsible()
  $('.button-collapse').sideNav('show');

  //=========================================
  //*****EXTRAS*******************
  //=========================================
  // setting options for question
  //add options handler
  var next = 1;
  $(".add-more").off().click(function(e) {
    // e.preventDefault();
    var addto = "#field" + next;
    var addRemove = "#field" + (next);
    next = next + 1;
    var newIn = '<input name="options" autocomplete="off" class="input opt" id="field' + next + '" type="text">';
    var newInput = $(newIn);
    var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button><div id="field"></div>';
    var removeButton = $(removeBtn);
    $(addto).after(newInput);
    $(addRemove).after(removeButton);
    $("#field" + next).attr('data-source', $(addto).attr('data-source'));
    $("#count").val(next);
    refreshAns();

    //remove option click handler
    $('.remove-me').off().click(function(e) {
      e.preventDefault();
      console.log("remove", e)
      var fieldNum = this.id.charAt(this.id.length - 1);
      var fieldID = "#field" + fieldNum;
      $(this).remove();
      $(fieldID).remove();
      refreshAns();
    });
  });

  $('.refresh').on('click', function() {
    refreshAns();
  });

  //preventing submiting form on pressing enter
  $(window).keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  //=========================================
  //*****QUESTION BANK*******************
  //=========================================
  //populating subject option after class has been chosen
  $('#qb_classs').on('change', function() {
    var $subject = $("#qb_subject");
    var o = $("option", $subject).eq(-1);
    $subject.children().not(":last").remove();
    $.get("/questionBank/class/" + this.value, function(res) {
      $(".selectpicker").selectpicker("refresh");

      if (res.classs) {
        var length = res.classs.subjects.length;
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            o.before($("<option>", {
              "text": res.classs.subjects[i].subjectName,
              "val": res.classs.subjects[i].subjectName
            }));

          }
          $(".selectpicker").selectpicker("refresh");
        }
      }

    });
  });

  //populating chapter option after subject has been chosen
  $('#qb_subject').on('change', function() {
    var className = $("#qb_classs option:selected").val();
    var $chapter = $("#qb_chapter");
    var o = $("option", $chapter).eq(-1);
    $chapter.children().not(":last").remove();
    $.get("/questionBank/class/" + className + "/subject/" + this.value, function(res) {
      $(".selectpicker").selectpicker("refresh");

      if (res.subject) {
        var length = res.subject.chapters.length;
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            o.before($("<option>", {
              "text": res.subject.chapters[i].chapterName,
              "val": res.subject.chapters[i].chapterName
            }));

          }
          $(".selectpicker").selectpicker("refresh");
        }
      }

    });
  });

  //populating topic option after chapter has been chosen
  $('#chapter').on('change', function() {
    //fetch the questions and show them
  });



});

function refreshAns() {
  var options = [];

  //selecting the not empty input
  $opt = $('.addNewQuestion input[type=text]')
    .filter(function(index) {
      if (this.value.length > 0) {
        return $(this).val();

      }
    });

  //setting up options string
  for (var i = 0; i < $opt.length; i++) {
    options.push($opt[i].value);
  }

  //setting up the ans radio checkbox
  $answerCheckbox = $('#answers');
  $answerCheckbox.children().remove();
  for (var j = 0; j < options.length; j++) {
    var opt = options[j].replace(/"/g, '\&quot;');
    opt = opt.replace(/'/g, '\&apos;');
    var cbox = '<div class="wrapAns"><p><input class="answer" type="checkbox" id="answ' + j + '" name ="answer" value="' + opt + '"><label for="answ' + j + '">' + options[j] + '</label></p></div><br>';
    $answerCheckbox.append(cbox);
  }

}
