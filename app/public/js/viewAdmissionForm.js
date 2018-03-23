$(function () {
  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0, // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function () {} // Function for after opening timepicker
  })

  $('select').material_select()
  $('#edit-form').on('click', function () {
    // console.log('clicked')
    $('#edit-form-submit').css('visibility', '')

    $('#name').prop('disabled', false)
    $('#dob').prop('disabled', false)
    $('#phone').prop('disabled', false)
    $('#emailId').prop('disabled', false)
    $('.gender').prop('disabled', false)
    $('#category').prop('disabled', false)
    $('#course').prop('disabled', false)
    $('#guardiansName').prop('disabled', false)
    $('#guardiansPhone').prop('disabled', false)
    $('#guardiansOccupation').prop('disabled', false)
    $('#address').prop('disabled', false)
    $('#perma-address').prop('disabled', false)
    $('#school').prop('disabled', false)
    $('#marks').prop('disabled', false)
    $('#board').prop('disabled', false)
    $('#referral').prop('disabled', false)

    $('select').material_select()
  })
})
