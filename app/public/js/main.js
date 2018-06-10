$(function() {
  $(window).keydown(function(event) {
    if (event.keyCode == 13) {
      // event.preventDefault()
      return true;
    }
  });

  // For error and success toasts notification
  $errorCard = $("#error-card");
  $successCard = $("#success-card");
  $("select[required]").css({
    display: "block",
    height: 0,
    padding: 0,
    width: 0,
    position: "absolute"
  });
  if ($errorCard.length > 0) {
    Materialize.toast($errorCard.text(), 5000);
    $(".toast:last").css("background-color", "#f44336");
  }

  if ($successCard.length > 0) {
    Materialize.toast($successCard.text(), 5000);
    $(".toast:last").css("background-color", "#13b38b");
  }

  $("select").material_select();

  $("nav")
    .find("a")
    .not(".button-collapse")
    .each(function() {
      // console.log("path0");

      var href = $(this).attr("href");
      var path = window.location.pathname;
      console.log("path", path, href);

      if (path.substring(0, href.length) === href) {
        $(this)
          .closest("li")
          .addClass("active-link");
      }
    });
  // Date picker initialization
  if ($(".datepicker").length !== 0) {
    $(".datepicker").pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: "Today",
      clear: "Clear",
      close: "Ok",
      closeOnSelect: true // Close upon selecting a date,
    });
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(function(reg) {
        // registration worked
        // console.log('Registration succeeded. Scope is ' + reg.scope);
      })
      .catch(function(error) {
        // registration failed
        // console.log('Registration failed with ' + error);
      });
  }

  /// NAVBAR INIT
  $(".button-collapse").sideNav({
    menuWidth: 300, // Default is 300
    edge: "left", // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,
    onOpen: function(el) {
      $("body").css("padding-left", "300px");
      $("footer").css("padding-left", "300px");
      $("#sidenav-overlay").remove();
      $(".drag-target").remove();
      $("body").css("overflow-y", "scroll");
      // $('body').css('overflow-y', 'scroll')
    },
    onClose: function(el) {
      $("body").css("padding-left", "0");
      $("footer").css("padding-left", "0");
    }
  });

  $(".collapsible").collapsible();
  $(".button-collapse").sideNav("show");
  caches.open("jwt-cache").then(cache => {
    cache.match("admin/token").then(res => {
      if (!res) {
        if (!localStorage.getItem("token")) {
          $("#slide-out").append(
            $(
              '<li><a href="/admin/login"><i class="material-icons white-text">perm_identity</i>Login</a></li><li><a href="/admin/signup"><i class="fa fa-user-plus white-text"></i>Signup</a></li>'
            )
          );
        } else {
          // console.log('token found local', res)
          $("#slide-out").append(
            $(
              '<li class="no-padding"><a href="#!" ><i class="material-icons white-text">perm_identity</i>Profile</a></li><li class="no-padding"><a href="#!" onclick="logout()"><i class="material-icons white-text">exit_to_app</i>Logout</a></li>'
            )
          );
        }
      } else {
        // console.log('token found', res)

        $("#slide-out").append(
          $(
            '<li class="no-padding"><a href="#!" ><i class="material-icons white-text">perm_identity</i>Profile</a></li><li class="no-padding"><a href="#!" onclick="logout()"><i class="material-icons white-text">exit_to_app</i>Logout</a></li>'
          )
        );
      }
    });
  });
});
function logout() {
  caches.delete("jwt-cache").then(function(boolean) {
    // your cache is now deleted
    window.location.replace("/admin/login");
  });
  localStorage.removeItem("token");
}
