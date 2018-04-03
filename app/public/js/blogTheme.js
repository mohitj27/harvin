$(function () {
  if ($('.pagination').length > 0) {
		let activePage = $('.active-chip').text()
		// console.log('activepage1', activePage)
		activePage = +activePage.trim()
		let prevPage = activePage - 1
		let nextPge = activePage + 1

		$('#prev-button').attr('href', '/blog?page='+ prevPage)
		$('#next-button').attr('href', '/blog?page='+ nextPge)
  }
})
