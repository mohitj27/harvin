$(function() {
  $("#submit-btn").on("click", function (e) {
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();

    $.ajax({
      url: "/admin/login",
      method: "post",
      data: {
        username: username,
        password: password
      },
      success: function(res) {
        if (res) {
          // console.log('res', res)
          var tokenResp = new Response(res.token);
          self.caches.open("jwt-cache").then(function(cache) {
            // Do something with your cache
            cache.put("token", tokenResp.clone());
            // tokenResp.text().then((text) => {
            //   // console.log(text)
            // });
          });
          localStorage.setItem("token", res.token);
          $(".toast:last").css("background-color", "#13b38b");
          setTimeout(function() {
            window.location.replace("/admin");
          }, 300);
        }
      },
      error: function(err) {
        if (err) {
          // console.log('err', err)
          Materialize.toast($("<span>" + err.responseText + "</span>"), 4000);
          $(".toast:last").css("background-color", "#f44336");
        }
      },
      complete: function() {
        // console.log('complete')
      }
    });
  });
});
