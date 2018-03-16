self.addEventListener('install', function(event) {
  console.log('installing')
});
// self.addEventListener('fetch',function(event){
// console.log(event.request)
//
// let mode=event.request.mode
// console.log('mode',mode)
//
//   var myHeaders = new Headers({    Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: `Bearer 21389172378162387`,});
//
//   let req=event.request
//   url=req.url.toString()
//
//   let options={
//     method:req.method,
//     headers:myHeaders,
//     cache:req.cache,
//     credentials:req.credentials,
//     referrerPolicy:req.referrerPolicy,
//     referrer:req.referrer,
//     redirect:req.redirect,
//   }
//   let myReq=new Request(url,options)
// if(mode==='no-cors')
//   event.respondWith(fetch(myReq))
//   else event.respondWith(fetch(event.request))
// })


self.addEventListener('fetch',e =>{
  let url = new URL(e.request.url)
  if(url.origin === location.origin){
    let r = new Request(e.request);
    r.headers.append('Authorization','Bearer dsalkdjlskajdkl');
    e.respondWith(fetch(r));
  }
})
