(function ($) {
  $(function () {
    $('#sign_up').on('click', function () { registerNowButtonClicked(event) });
    $("nav")
      .find("a")
      .not(".button-collapse")
      .each(function () {
        // console.log("path0");

        var href = $(this).attr("href");
        var path = window.location.pathname;
        // console.log("path", path, href);

        if (path.substring(0, href.length) === href) {
          $(this)
            .closest("li")
            .addClass("active-link");
        }
      });
    $(".button-collapse").sideNav();
    $(".parallax").parallax();
    // $('.carousel').carousel();
    $(".carousel").carousel({
      fullWidth: true,
      duration: 700
    });

    $(".tap-target").tapTarget("open");
    state = true;
    // $('.tap-target').tapTarget('close');

    $(".dropdown-button").dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: "left", // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
  }); // end of document ready

  // declare variable
  var scrollTop = $(".scrollTop");

  $(window).scroll(function () {
    // declare variable
    var topPos = $(this).scrollTop();

    // if user scrolls down - show scroll to top button
    if (topPos > 100) {
      $(scrollTop).css("opacity", "1");
    } else {
      $(scrollTop).css("opacity", "0");
    }
  }); // scroll END

  //Click event to scroll to top
  $(scrollTop).click(function () {
    $("html, body").animate(
      {
        scrollTop: 0
      },
      800
    );
    return false;
  }); // click() scroll top EMD
})(jQuery); // end of jQuery name space
var state = true;

function tap() {
  // console.log('tap');
  if (!state) {
    $(".tap-target").tapTarget("open");

    state = true;
  } else {
    $(".tap-target").tapTarget("close");
    state = false;
  }
}

function registerNowButtonClicked(event) {
  event.preventDefault();
  let first_name = $('#first_name').val().trim();
  let last_name = $('#last_name').val().trim();
  let email = $('#email').val().trim();
  let phone = $('#phone').val().trim();
  $.ajax({
    method: "POST",
    url: "/register",
    data: {
      fullName: first_name + ' ' + last_name,
      email: email,
      phone: phone
    }
  })
    .done(function (res) { console.log("done", res) })
    // .success(function (response) {
    //   console.log('sdfsfs', response)
    //   alert(response)
    // })
    .fail(function () { console.log('an error has occured') });
}

function scrollDown() {
  // console.log('scroll')
  $("html, body").animate(
    {
      scrollTop: $("#features").offset().top
    },
    1000
  );
}

function removeTopbar() { }
