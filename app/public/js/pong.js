const canvas = document.getElementById('pong')
const context = canvas.getContext('2d')


class Vec {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}
class Rect {

  constructor(w, b) {
    this.pos = new Vec
    this.size = new Vec(w, b)

  }

  get left()
     {
         return this.pos.x - this.size.x / 2;
     }
     get right()
     {
         return this.pos.x + this.size.x / 2;
     }
     get top()
     {
         return this.pos.y - this.size.y / 2;
     }
     get bottom()
     {
         return this.pos.y + this.size.y / 2;
     }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d')

    this.ball = new Ball()
    this.ball.pos.y = 100
    this.ball.pos.x = 10
    this.ball.vel.x = 100
    this.ball.vel.y = 100

    this.players=[
      new Player,
      new Player
    ]
    this.players[0].pos.x=40;
    this.players[1].pos.x=this._canvas.width-40
    this.players.forEach(player=>{
      player.pos.y=this._canvas.height/3})
    let lastTime = 0;

      this.callback =(millis)=>{
      if (lastTime) {
        this.update((millis - lastTime) / 1000)

      };
      lastTime = millis
      requestAnimationFrame(this.callback)
    };
this.callback()

  }
  collide(player,ball){

          if (player.left < ball.right && player.right > ball.left &&
              player.top < ball.bottom && player.bottom > ball.top) {
              ball.vel.x = -ball.vel.x * 1;
              const len = ball.vel.len;
              //ball.vel.y += ball.vel.y * .2;
              ball.vel.len = len;
          }
  }

  draw(){

    //this._context.fillStyle = '#000'
    this._context.clearRect(0, 0, canvas.width, canvas.height);
    //this._context.fillRect(0, 0, this._canvas.width, this._canvas.height)
this.drawrect(this.ball)

this.players.forEach(player => this.drawrect(player));
}
  drawrect(rect){


    this._context.fillStyle = '#fff'
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y)

  }
  update(dt) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.vel.x = -this.ball.vel.x

    }

    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y

    }
   this.players[1].pos.y = this.ball.pos.y;
   this.players.forEach(player=>this.collide(player,this.ball))
    this.draw()



  }
}

class Ball extends Rect {

  constructor() {
    super(10, 10)
    this.vel = new Vec


  }
}
class Player extends Rect{

  constructor(){
super(20,50)
this.score=0

  }
}
const pong= new Pong(canvas)

canvas.addEventListener('mousemove',event=>{
pong.players[0].pos.y=event.offsetY

})
