$(function () {
	//=========================================
	//*****FILE UPLAOD************************
	//=========================================
	//content inside add button in selectpicker



	///NAVBAR INIT
	$('.button-collapse').sideNav({
       menuWidth: 300, // Default is 300
       edge: 'left', // Choose the horizontal origin
       closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
       draggable: true, // Choose whether you can drag to open on touch screens,
       onOpen: function(el) {},
       onClose: function(el) {}
     }
   );

	var content = "<input type=text onKeyDown='event.stopPropagation();' onKeyPress='addSelectInpKeyPress(this,event)' onClick='event.stopPropagation()' placeholder='Add item'> <span class='glyphicon glyphicon-plus addnewicon' onClick='addSelectItem(this,event,1);'></span>";

	//divider btw options and add button in selectpicker
	var divider = $('<option/>')
		.addClass('divider lastTwo')
		.data('divider', true);

	//add button in selectpicker
	var addoption = $('<option/>')
		.addClass('additem lastTwo')
		.data('content', content);
		
	//appending divider and add item element
	$(".selectpicker.addbtn")
		.append(divider)
		.append(addoption)
		.selectpicker();
		$(".selectpicker").selectpicker("refresh");
		

	//populating subject option after class has been chosen
	$('#classs').on('change', function () {
		var $subject = $("#subject");
		var o = $("option", $subject).eq(-2);
		$subject.children().not(".lastTwo").remove();
		$.get("/class/" + this.value, function (res) {
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
	$('#subject').on('change', function () {
		var className = $("#classs option:selected").val();
		var $chapter = $("#chapter");
		var o = $("option", $chapter).eq(-2);
		$chapter.children().not(".lastTwo").remove();
		$.get("/class/" + className + "/subject/" + this.value, function (res) {
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
	$('#chapter').on('change', function () {
		//select topic selectpicker
		var $topic = $("#topic");
		var o = $("option", $topic).eq(-2);

		//select topic description areatext
		var $chapterDesc = $("#chapterDescription");
		$chapterDesc.val("");

		var $topicDesc = $("#topicDescription");
		$topicDesc.val("");

		$topic.children().not(".lastTwo").remove();
		$.get("/chapter/" + this.value, function (res) {
			$(".selectpicker").selectpicker("refresh");

			if (res.chapter) {
				var length = res.chapter.topics.length;
				if (length > 0) {
					for (var i = 0; i < length; i++) {
						o.before($("<option>", {
							"text": res.chapter.topics[i].topicName,
							"val": res.chapter.topics[i].topicName
						}));

					}
					$chapterDesc.val(res.chapter.chapterDescription);
					$(".selectpicker").selectpicker("refresh");
				}
			}

		});
	});

	//populating topic option after chapter has been chosen
	$('#topic').on('change', function () {
		var $topicDesc = $("#topicDescription");
		$topicDesc.val("");
		$.get("/topic/" + this.value, function (res) {
			$(".selectpicker").selectpicker("refresh");
			if (res.topic) {
				$topicDesc.val(res.topic.topicDescription);
				$(".selectpicker").selectpicker("refresh");
			}
		});
	});


	//selecting the subject available in particular batch
	$('#batch').on('change', function () {
		var $subjectsInBatch = $("#subjectsInBatch");
		var $batchDesc = $("#batchDesc");
		var o = $("option", $subjectsInBatch).not(".lastTwo");
		$.get("/batches/" + this.value, function (res) {
			o.each(function (index) {
				this.selected = false;
			});
			$(".selectpicker").selectpicker("refresh");
			if (res.batch) {
				var length = res.batch.subjects.length;
				if (length > 0) {
					for (var i = 0; i < length; i++) {
						o.each(function (j){
							if (j > 0) {
								if (this.value == res.batch.subjects[i]._id)
									this.selected = true;
							}
						});
					}
				}
				$batchDesc.val(res.batch.batchDesc);
				$(".selectpicker").selectpicker("refresh");

			}
		});
	});

	//=========================================
	//*****SHOWING DATABASE*******************
	//=========================================

	//retrieve collection name from button and populate document column
	$(".collection").click(function (event) {
		var collectionName = this.value;
		$.get("/db/collections/" + this.value, function (res) {
			$documents = $("#documents");
			$documents.children("#objects").text(collectionName);
			$documents.children().not(":first").remove();

			$data = $("#data");
			$data.children().not(":first").remove();

			if (res.objects.length > 0) {
				res.objects.forEach(function (object) {
					$button = $("<button>", {
						"class": "btn btn-large btn-default objectButton document ids",
						"text": object._id,
						"value": res.dbType
					});
					$documents.append($button);
				}, this);
			}
		});
	});

	//retrieving json of the particular document and populate data column
	$("#documents").on('click', ".document", function (event) {
		var documentId = event.target.textContent;
		var collectionName = event.target.value;
		$.get("/db/collections/" + collectionName + "/" + documentId, function (res) {
			$data = $("#data");
			$data.children().not(":first").remove();
			if (res.object) {
				//showing json data
				var objectString = JSON.stringify(res.object, null, 4);
				$pre = $("<pre>", {
					"class": "data pre-scrollable",
					"text": objectString,
					"height": "300px"
				});
				$data.append($pre);

				if (collectionName == "batch") {
					//update and delete data button
					$form = $("<form>", {
						class: "dbUpdateForm",
						action: "/db/collections/" + collectionName + "/" + documentId + "/edit",
						"method": "POST"
					});
					$hiddenObjectInput = $("<input>", {
						type: "hidden",
						value: objectString,
						name: "object"
					});
					$hiddenCollectionNameInput = $("<input>", {
						type: "hidden",
						value: collectionName,
						name: "collectionName"
					});
					$updateButton = $("<button>", {
						class: "btn btn-warning updateButton",
						text: "Update"
					});
					$deleteButton = $("<button>", {
						class: "btn btn-danger deleteButton",
						text: "Delete",
						formaction: "/db/collections/" + collectionName + "/" + documentId + "?_method=delete",
						"method": "POST"
					});
					$data.append($form);
					$form.append($hiddenObjectInput)
						.append($hiddenCollectionNameInput)
						.append($updateButton)
						.append($deleteButton);
				}


			}
		});

	});

	//=========================================
	//*****EXTRAS*******************
	//=========================================
	$("#dtBox").DateTimePicker();

	// setting options for question
	//add options handler
	var next = 1;
    $(".add-more").off().click(function(e){
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
        $("#field" + next).attr('data-source',$(addto).attr('data-source'));
		$("#count").val(next);
		refreshAns();

		//remove option click handler
		$('.remove-me').off().click(function(e){
			e.preventDefault();
			console.log("remove", e)
			var fieldNum = this.id.charAt(this.id.length-1);
			var fieldID = "#field" + fieldNum;
			$(this).remove();
			$(fieldID).remove();
			refreshAns();
		});
	});

	$('.refresh').on('click', function(){
		refreshAns();
	});

	//preventing submiting form on pressing enter
	$(window).keydown(function(event){
		if(event.keyCode == 13) {
		  event.preventDefault();
		  return false;
		}
	});

	//=========================================
	//*****QUESTION BANK*******************
	//=========================================
	//populating subject option after class has been chosen
	$('#qb_classs').on('change', function () {
		var $subject = $("#qb_subject");
		var o = $("option", $subject).eq(-1);
		$subject.children().not(":last").remove();
		$.get("/questionBank/class/" + this.value, function (res) {
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
	$('#qb_subject').on('change', function () {
		var className = $("#qb_classs option:selected").val();
		var $chapter = $("#qb_chapter");
		var o = $("option", $chapter).eq(-1);
		$chapter.children().not(":last").remove();
		$.get("/questionBank/class/" + className + "/subject/" + this.value, function (res) {
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
	$('#chapter').on('change', function () {
		//fetch the questions and show them
	});



});

function refreshAns(){
	var options = [];

	//selecting the not empty input
	$opt = $('.addNewQuestion input[type=text]')
	.filter(function (index) {
		if(this.value.length > 0){
			return $(this).val();

		}
	});

	//setting up options string
	for (var i = 0; i < $opt.length ; i++){
		options.push($opt[i].value);
	}

	//setting up the ans radio checkbox
	$answerCheckbox = $('#answers');
	$answerCheckbox.children().remove();
	for (var j = 0; j < options.length; j++) {
		var opt = options[j].replace(/"/g, '\&quot;');
		opt = opt.replace(/'/g, '\&apos;');
		var cbox = '<div class="wrapAns"><p><input class="answer" type="checkbox" id="answ'+ j + '" name ="answer" value="'+opt+'"><label for="answ'+ j + '">'+options[j]+'</label></p></div><br>';
		$answerCheckbox.append(cbox);
	}

}

function addSelectItem(t, ev) {

	ev.stopPropagation();

	var txt = $(t).prev().val().replace(/[|]/g, "");
	if ($.trim(txt) == '') return;
	var p = $(t).closest(".dropdown-menu.open").next();

	var o = $('option', p).eq(-2);

	o.before($("<option>", {
		"selected": false,
		"text": txt,
		"val": txt
	}));
	p.selectpicker('refresh');
}

function addSelectInpKeyPress(t, ev) {
	ev.stopPropagation();

	// do not allow pipe character
	if (ev.which == 124) ev.preventDefault();

	// enter character adds the option
	if (ev.which == 13) {
		ev.preventDefault();
		addSelectItem($(t).next(), ev);
	}
}
