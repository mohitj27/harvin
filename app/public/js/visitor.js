$(function(){
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

})
