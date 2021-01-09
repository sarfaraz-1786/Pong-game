const canvas = document.getElementById('pong');
const cs = canvas.getContext('2d');
let action1 = true;
const reload = document.querySelector('.button')
//circle object
const circle = {
    x:canvas.width/2,
    y:canvas.height/2,
    r:15,
    speed:4,
    velocityX:4,
    velocityY:4,
    color:"white"
}
//c rect OBJ
const Rect = {
    x:canvas.width,
    y:canvas.height,
    color:"black"
}
// text user OBJ
const txtuser = {
    color:"white",
    num:0,
    x:canvas.width/4,
    y:canvas.height/5,
    txt:""
}
// txt computer OBJ
const txtcom = {
    color:"white",
    num:0,
    x:canvas.width/1.5,
    y:canvas.height/2 - 120,
    txt:""
}
//paddle user OBJ
const paduser = {
    color:"white",
    x:0,
    y:canvas.height/2 - 60,
    w:20,
    h:120
}
//paddle computer OBJ
const padcom = {
    color:"white",
    x:canvas.width-20,
    y:canvas.height/2 - 60,
    w:20,
    h:120
}
//net obj
const net = {
    color:"white",
    x:canvas.width/2 -2,
    y:0,
    w:4,
    h:10
}

////////////////////////////////////////////////----FUNCTIONS------/////////////////////////////////////////////////////

//rectangle
function drawRect(x, y, w, h, color) {
    cs.fillStyle = color;
    cs.fillRect(x, y, w, h);
}
//circle
function drawCircle(x,y,r,color){
    cs.fillStyle = color;
    cs.beginPath();
    cs.arc(x,y,r,0,Math.PI*2,false);
    cs.closePath();
    cs.fill();
}
//text
function drawText(num,txt,x,y,color){
    cs.fillStyle = color;
    cs.font = "45px fantasy";
    cs.fillText(num,x,y)
    cs.fillText(txt,400,200)
}
//paddle
function paddleNet(x,y,w,h,color){
    for(let i=0;i<20;i++){
        drawRect(x,y,w,h,color);
        y+=20
    }
}
//rendering the game , collision detection
function render(){
    drawRect(0, 0, Rect.x, Rect.y, Rect.color);
    drawCircle(circle.x,circle.y,circle.r,circle.color);
    drawText(txtuser.num,txtuser.txt,txtuser.x,txtuser.y,txtuser.color);
    drawText(txtcom.num,txtcom.txt,txtcom.x,txtcom.y,txtcom.color);
    drawRect(paduser.x,paduser.y,paduser.w,paduser.h,paduser.color);
    drawRect(padcom.x,padcom.y,padcom.w,padcom.h,padcom.color);
    paddleNet(net.x,net.y,net.w,net.h,net.color)
}
function collision(b,p){
    b.top = b.y - b.r;
    b.left = b.x - b.r;
    b.right = b.x + b.r;
    b.bottom = b.y + b.r;

    p.top = p.y;
    p.bottom = p.y + p.h;
    p.left = p.x;
    p.right = p.x + p.w;

    return b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left;
}

let computerlvl = 0.035; // difficulty ai parameter

function update(){
    circle.x += circle.velocityX;
    circle.y += circle.velocityY;
    if(circle.y + circle.r > canvas.height || circle.y - circle.r < 0){
        circle.velocityY = -circle.velocityY;
    }
    
    padcom.y += (circle.y - (padcom.y + padcom.h/2))*computerlvl;
    console.log(computerlvl)
    let player = (circle.x < canvas.width/2) ? paduser : padcom;

    if(collision(circle,player)){
        let collidePoint = (circle.y - (player.y + player.h/2));
        let Point = collidePoint/(player.h/2);
        let radianAngle = Point * Math.PI/4 * 1.2;
        let direction = (circle.x < canvas.width/2) ? 1 : -1;
        circle.velocityX = direction*circle.speed*Math.cos(radianAngle); 
        circle.velocityY = circle.speed*Math.sin(radianAngle);
        circle.speed+=1;
    }
    function reset(){
        if(txtuser.num < 5 && txtcom.num < 5){
            circle.x = canvas.width/2;
            circle.y = canvas.height/2;
        }else {
            circle.x = canvas.width/2;
            circle.y = canvas.height/2;
            action1 = false;
            if(txtuser.num ===5){
                txtuser.txt ="winner"
            }else{
                txtcom.txt = "winner"
            }
        }
    }
    if(circle.x + circle.r > canvas.width ){
        circle.speed = 4;
        circle.velocityX = 4;
        circle.velocityY = 4;
        computerlvl = computerlvl + 0.01;
        console.log(computerlvl)
        txtuser.num++;
        reset();
    }else if(circle.x - circle.r < 0){
        circle.speed = 4;
        circle.velocityX = 4;
        circle.velocityY = 4;
        txtcom.num++;
        reset();
    }
}  
function game(){
    render();
    if(action1){
        update();
    }
}

let fps = 60;
setInterval(game,1000/fps);

//move paddle function mouse
canvas.addEventListener("mousemove",movepaddle);

function movepaddle(e){
    let rect = canvas.getBoundingClientRect();
    paduser.y = e.clientY - rect.top - paduser.h/2;
}
//keyboard event lisetener
document.addEventListener("keydown",paddleUp);

function paddleUp(e){
    console.log(e.key)
    if(e.key == 'ArrowUp'){
        paduser.y -= 12;
    }else if(e.key == 'ArrowDown'){
        paduser.y += 12;
    }
}

//reload resetting game

reload.addEventListener("click",reloadFunction);

function reloadFunction(){
    location.reload();
}