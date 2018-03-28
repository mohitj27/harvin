self.addEventListener('install', function(event) {
  // console.log('installing')
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

// self.addEventListener('fetch',e =>{
//   let url = new URL(e.request.url)
//   let token
//
//   if(url.origin === location.origin){
//     let r = new Request(e.request);
//
//
//   e.waitUntil( caches.open('jwt-cache').then(function(cache) {
//       return cache.match("admin/token")
//     }).then(respToken=>{
//       return respToken.text().then((text)=>{
//         token=text
//         r.headers.append('Authorization',`Bearer ${token}`);
//         e.respondWith(fetch(r));
//         return text
//       })
//     }))
//   }
//   else {
//     e.respondWith(fetch(e.request))
//   }
// })


self.addEventListener('fetch',e =>{
  let url = new URL(e.request.url);
  let token = "";
  if(url.origin === location.origin){
    let r = new Request(e.request);

    e.respondWith(caches.open('jwt-cache').then(cache => {
      return cache.match("admin/token").then(res => {
        if(!res){
          return fetch(r);
        }
        return res.text().then(token => {
          r.headers.append("Authorization",`Bearer ${token}`);
          return fetch(r);
        })
      })
    }))

}});
