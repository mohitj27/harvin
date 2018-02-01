$(function() {


      $('ul.tabs').tabs();


      $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        draggable: true, // Choose whether you can drag to open on touch screens,
        onOpen: function(el) { /* Do Stuff*/ }, // A function to be called when sideNav is opened
        onClose: function(el) { /* Do Stuff*/ }, // A function to be called when sideNav is closed
      });

      var socket = io("http://localhost:3001/")
      socket.emit('message', 'Hello server');

      socket.on('connect', function() {
        socket.emit('message', 'Hello server12');

      });

      let imageTrackArr = []
      let uploadCounter = 1
      let span = document.createElement('span')


      function checkBlogTitle(event) {
        let blogTitle = $('#blog_title').val()
        console.log('title1', blogTitle)
        if (blogTitle == '') {
          event.preventDefault()
          event.stopPropagation()

          alert('please specify the blog title')
          return false
        } else {
          return true
        }
      }

      function handleFileSelect(evt) {

        /**/



        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
          0

          // Only process image files.
          if (!f.type.match('image.*')) {
            continue;
          }

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
              return function(e) {
                //SDend image

                // Render thumbnail.
                var span = document.createElement('span');

                span.innerHTML = ['<span><img class="thumb" src="', e.target.result,
                  '" title="', escape(theFile.name), '"/></span >'].join('');
                  document.getElementById('img-to-upload').insertBefore(span, null);
                }
              })(f)

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
          }
          /*/*/
          var fileReader = new FileReader()

          console.log('state of reader', fileReader.readyState)
          // if(fileReader.readyState!=0||fileReader.readyState!=1)
          // return;
          let blogTitle = $('#blog_title').val()

          console.log('evt', evt)
          var file = evt.target.files[0]; // FileList object
          console.log('file name', file.name)
          console.log('file name', evt.target.files)
          $.post('/admin/blog/' + blogTitle + '/images', {
            'filename': file.name
          })
          if (!file.type.match("image.*"))
            return

          console.log(file)

          fileReader.readAsArrayBuffer(file);
          fileReader.onload = (evt) => {



            var arrayBuffer = fileReader.result;
            socket.emit('hello', 'hello')
            socket.emit('slice upload', {
              name: file.name,
              type: file.type,
              size: file.size,
              data: arrayBuffer
            });
          }

          fileReader.onloadend = () => {
            fileReader = null
            socket.emit('end upload', 'end')
            $('.thumb:last').after('<span><i class="material-icons">check</i></span>')
          }
          socket.on('end upload', (data) => {
            // console.log(fileReader.result.toString())
            // fileReader.result = {}


            console.log('end upload',data)

          });
          socket.on('upload error', () => {
            console.log('aborting')
            fileReader.abort()
          });
          // Render thumbnail.



          socket.on('request slice upload', (data) => {
            var place = data.currentSlice * 100000,
              slice = file.slice(place, place + Math.min(100000, file.size - place));

            try {
              fileReader.readAsArrayBuffer(slice)
            } catch (err) {
              console.log(err)
              fileReader.abort()
            }


          });



        }


        document.getElementById('files').addEventListener('change', handleFileSelect, false)
        document.getElementById('files').addEventListener('click', checkBlogTitle, false)
        // setInterval(checkUpload, 2000)
        //
        // function checkUpload() {}
      })
