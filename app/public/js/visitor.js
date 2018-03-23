$(function(){
	$('.modal').modal();

	$('.modal-trigger').on('click', function () {
		// console.log('text', $(this).siblings());
		$modalContent = $('.modal-content')
		$modalContent.children().remove()
		$modalContent.append($('<h3>', {text: 'Visitor info'}))
		$modalContent.append($('<p>', {text: 'Comments: ' + $(this).siblings('#comments').text()}))
		$modalContent.append($('<p>', {text: 'School: ' + $(this).siblings('#school').text()}))
		$modalContent.append($('<p>', {text: 'Aim: ' + $(this).siblings('#aim').text()}))
		$modalContent.append($('<p>', {text: 'Address: ' + $(this).siblings('#address').text()}))
	})

})
