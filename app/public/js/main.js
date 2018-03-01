$(function () {
  // For error and success toasts notification
  $errorCard = $('#error-card')
  $successCard = $('#success-card')

  if ($errorCard.length > 0) {
    Materialize.toast($errorCard.text(), 5000)
    $('.toast:last').css('background-color', '#f44336')
  }

  if ($successCard.length > 0) {
    Materialize.toast($successCard.text(), 5000)
    $('.toast:last').css('background-color', '#13b38b')
  }

  $('select').material_select()

  // Date picker initialization
  if ($('.datepicker').length !== 0) {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: true // Close upon selecting a date,
    })
  }

  /// NAVBAR INIT
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,
    onOpen: function (el) {
      $('body').css('padding-left', '300px')
      $('footer').css('padding-left', '300px')
      $('#sidenav-overlay').remove()
      $('.drag-target').remove()
      $('body').css('overflow-y', 'scroll')
      // $('body').css('overflow-y', 'scroll')
    },
    onClose: function (el) {
      $('body').css('padding-left', '0')
      $('footer').css('padding-left', '0')
    }
  })

  $('.collapsible').collapsible()
  $('.button-collapse').sideNav('show')
})
