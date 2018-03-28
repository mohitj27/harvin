function confirmDelete(currElement) {
  elem = currElement;
  var $toastContent = $(
    "<span>Are you sure you want to Delete this Batch?</span>"
  )
    .add(
      $(
        '<button class="btn-flat toast-action" onClick="confirmed()">YES</button>'
      )
    )
    .add(
      $(
        '<button class="btn-flat toast-action" onClick="dismissed()">No</button>'
      )
    );
  Materialize.toast($toastContent, 10000);
}

function dismissed() {
  Materialize.Toast.removeAll();
}

function confirmed() {
  $tr = $(elem)
    .parent()
    .parent();
  let batchId = $tr.attr("id");

  $.ajax({
    url: "/admin/batches/" + batchId,
    method: "DELETE",
    success: function(result) {
      $tr.fadeOut("fast", () => {
        $tr.remove();
      });
      Materialize.toast($("<span>Batch Deleted Successfully</span>"), 4000);
      $(".toast:last").css("background-color", "#13b38b");
    },
    error: function(error) {
      if (error) {
        Materialize.toast($("<span>" + error.responseText + "</span>"), 4000);
        $(".toast:last").css("background-color", "#f44336");
      }
    }
  });
  Materialize.Toast.removeAll();
}

$(function() {
  function onBatchSelect(selectedBatchName) {
    let batchName = selectedBatchName || $("#batchName").val();
    if (batchName.length > 0) {
      let $subjectsInBatch = $("#subjectsInBatch");
      let $batchDesc = $("#batchDesc");
      let o = $("option", $subjectsInBatch);
      $.get("/admin/batches/" + batchName, function(res) {
        o.each(function(index) {
          this.selected = false;
        });
        $batchDesc.val("");

        $("select").material_select();

        let subjects;
        if (res.batch) {
          subjects = res.batch.subjects;
          let length = subjects.length;
          if (length > 0) {
            for (var i = 0; i < length; i++) {
              o.each(function(j) {
                if (j > 0) {
                  if (this.value == subjects[i]._id) this.selected = true;
                }
              });
            }
            $("select").material_select();
          }
          $batchDesc.val(res.batch.batchDesc);
        } else $batchDesc.val("");
      });
    }
  }

  $.get("/admin/batches", function(res) {
    batches = {};

    if (res.batches) {
      res.batches.forEach(batch => {
        batches[batch.batchName] = null;
      });
    }

    $("#batchName").autocomplete({
      data: batches,
      onAutocomplete: onBatchSelect
    });
  });
});
