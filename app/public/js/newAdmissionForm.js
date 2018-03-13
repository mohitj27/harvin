const dateFromId = function (id) {
  let timestamp = id.toString().substring(0, 8)
  let date = new Date(parseInt(timestamp, 16) * 1000).getTime()
  return date
};

const fillData = function (data) {
  console.log('data', data)
  if (data) {
    $('#auto-address').val(data.address)
    $('#auto-emailId').val(data.emailId)
    $('#auto-school').val(data.school)
    $('#auto-referral').val(data.referral)
  }
}

const updateData = function () {
  let data = {}
  data.address = $('#auto-address').val()
  data.emailId = $('#auto-emailId').val()
  data.school = $('#auto-school').val()
  data.referral = $('#auto-referral').val()
  return data
};

$(function () {
  let data

  $('#fetchedFieldsModal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: 0.5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    endingTop: '20%',
    outDuration: 200, // Transition out duration
    ready: function (modal, trigger) {
      // Callback for Modal open. Modal and trigger parameters available.
      // alert('Ready')
      fillData(data)
      console.log(modal, trigger)
    },
    complete: function () {
      // alert('Closed')
      data = updateData()
      $('#wizard').steps('next')
    } // Callback for Modal close
  })

  $('#previewModal').modal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: 0.5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    endingTop: '20%',
    outDuration: 200, // Transition out duration
    ready: function (modal, trigger) {
      // Callback for Modal open. Modal and trigger parameters available.
      // alert('Ready')
      console.log('preview', $('#imgInp')[0].files['0'])
      readURL($('#imgInp')[0].files['0'])
    },
    complete: function () {
      // alert('Closed')
      console.log('preview closed')
    } // Callback for Modal close
  })
  $('select').material_select()
  $('#wizard').steps({
    bodyTag: 'section',
    transitionEffect: 'fade',
    /* Labels */
    labels: {
      cancel: 'Cancel?',
      current: 'current step:',
      pagination: 'Pagination',
      finish: 'Finish!!',
      next: 'Next >',
      previous: '< Previous',
      loading: 'Loading ...'
    },

    onStepChanging: function (event, currentIndex, newIndex) {
      console.log('curr0', currentIndex)
      console.log('new0', newIndex)
      if (currentIndex === 0 && newIndex === 1) {
        console.log('length', $('#phone').val().length)
        if ($('#phone').val().length < 10) {
          alert('Please enter a valid 10 digit phone number')
          return false
        }
      }
      return true
    },
    onStepChanged: function (event, currentIndex, priorIndex) {
      console.log('curr', currentIndex)
      console.log('prior', priorIndex)
      if (currentIndex === 1 && priorIndex === 0) {
        let phone = $('#phone').val()
        console.log('clicked', phone)

        $.ajax({
          url: '/vms/phone/' + phone,
          method: 'GET',
          success: function (res) {
            console.log('res', res)
            if (res.length > 0) {
              console.log(
                'date',
                res[res.length - 1]._id,
                dateFromId(res[res.length - 1]._id)
              )
              data = res[res.length - 1]
              $('#fetchedFieldsModal').modal('open')
            }
          },
          error: function (err) {
            console.log('err', err)
            //
          }
        })
      } else if (currentIndex === 1) {
        fillData(data)
        $('#fetchedFieldsModal').modal('open')
      }
      return true
    },
    onFinishing: function (event, currentIndex) {
      return true
    },
    onFinished: function (event, currentIndex) {
      alert('Submitted!')
    }
  })

  $('select').material_select()

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: true // Close upon selecting a date,
  })

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

  function readURL (file) {
    console.log('show file', typeof file, file)
    if (file) {
      var reader = new FileReader()

      reader.onload = function (e) {
        $('#imgPrev').attr('src', e.target.result)
      };

      reader.readAsDataURL(file)
    }
  }

  $('#showprev').on('click', function () {
    readURL($('#imgInp')[0].files['0'])
  })

})
