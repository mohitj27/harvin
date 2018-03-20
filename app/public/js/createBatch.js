$(function() {
  function onBatchSelect(selectedBatchName) {
    let batchName = selectedBatchName || $('#batchName').val()
    if (batchName.length > 0) {
      let $subjectsInBatch = $('#subjectsInBatch')
      let $batchDesc = $('#batchDesc')
      let o = $('option', $subjectsInBatch)
      $.get('/admin/batches/' + batchName, function(res) {
        o.each(function(index) {
          this.selected = false;
        })
        $batchDesc.val('')

        $('select').material_select();

        let subjects;
        if (res.batch) {
          subjects = res.batch.subjects;
          let length = subjects.length;
          if (length > 0) {
            for (var i = 0; i < length; i++) {
              o.each(function(j) {
                if (j > 0) {
                  if (this.value == subjects[i]._id)
                    this.selected = true;
                }
              });
            }
            $('select').material_select();

          }
          $batchDesc.val(res.batch.batchDesc)
        } else $batchDesc.val('')

      });
    }
  }

  $.get('/admin/batches', function(res) {

    batches = {};

    if (res.batches) {
      res.batches.forEach((batch) => {
        batches[batch.batchName] = null
      })
    }

    $('#batchName').autocomplete({
      data: batches,
      onAutocomplete: onBatchSelect
    });
  })
})
