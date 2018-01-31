$(function(){

  let path=$('#path').html()
  path=path.trim()
    $.get('/blog/'+path,function(data){
      console.log(data)
      $('#content').html($(data))
    })

})
