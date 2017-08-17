$(function () {
	//=========================================
	//*****FILE UPLAOD************************
	//=========================================
	//content inside add button in selectpicker
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
	$('.selectpicker')
		.append(divider)
		.append(addoption)
		.selectpicker();

	//removing add item from #subjectInBatch        
	$("#subjectsInBatch").children().last().remove();
	$(".selectpicker").selectpicker("refresh");

	//populating subject option after class has been chosen
	$('#classs').on('change', function () {
		var $subject = $("#subject");
		var o = $("option", $subject).eq(-2);
		$subject.children().not(".lastTwo").not(":first").remove();
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
		var $chapter = $("#chapter");
		var o = $("option", $chapter).eq(-2);
		$chapter.children().not(".lastTwo").not(":first").remove();
		$.get("/subject/" + this.value, function (res) {
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

		$topic.children().not(".lastTwo").not(":first").remove();
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
								if (this.value == res.batch.subjects[i].subjectName)
									this.selected = true;
							}
						});
					}
				}
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

				if (collectionName == "file" || collectionName == "batch") {
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

});

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

