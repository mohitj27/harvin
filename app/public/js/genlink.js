$(()=>{

  var clipboard = new ClipboardJS('.clipboard');


  clipboard.on('success', function(e) {
      new Materialize.Toast('<span>Link Copied<span>',1000)
  });

  clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
  });


})
