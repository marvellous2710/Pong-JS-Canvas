let loop, cnv, ctx;
let ball, paddle1, paddle2;

window.onload = function() {

    cnv = document.getElementById("canvas");
    ctx = cnv.getContext("2d");

    init();
    addEventListener('mousemove',() => {
        let rect = cnv.getBoundingClientRect();
        let root = document.documentElement;
        let mouseY = event.clientY - rect.top - root.scrollTop;
        paddle1.y = mouseY - (paddle1.height/2);
    })
    loop = setInterval(() => {
        update();
        render();
    }, 1000/60);
}

function init() {//--------LES JOUEURS
    paddle1 = {
        width:20,
        height:140,
        offset:35,
        x:10,
        y:(cnv.height/2)-70,
        color:"#fff",
    }
    paddle2 = {
        width:20,
        height:140,
        offset:35,
        x:(cnv.width)-30,
        y:(cnv.height/2)-70,
        color:"#fff",
    }
    ball = {
        size:14,     
        x:(cnv.width/2),
        y:(cnv.height/2),
        xv:8,
        yv:8,
        color:"#fff",
    }
}

function update() {
    moveBall();
    movePaddle(paddle2);
    hitPaddle(paddle1);
    hitPaddle(paddle2);
}

function render() {
    drawRect(0,0,cnv.width,cnv.height,"#000");//couleur du background noir
    drawNet();
    drawRect(paddle1.x,paddle1.y,paddle1.width,paddle1.height,paddle1.color);
    //appeler les joueurs et la boul construit dans init pour les "dessiner"
    drawRect(paddle2.x,paddle2.y,paddle2.width,paddle2.height,paddle2.color);
    drawCircle(ball.x,ball.y,ball.size,ball.color);
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.fill;
}

function drawCircle(x, y, size, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, size, 0, Math.PI*2);
    ctx.fill();
}

function drawNet() {//----------LIGNE DU MILIEU
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;//taille 
    ctx.setLineDash([20,10]);
    ctx.beginPath();
    ctx.moveTo(cnv.width/2, 0);
    ctx.lineTo(cnv.width/2, cnv.height);
    ctx.stroke();
}

function moveBall() {
    ball.x = ball.x + ball.xv;
    ball.y = ball.y + ball.yv;
    if ( ball.x >= cnv.width || ball.x <= 0) {//condition pour que la ball tape dans les murs
        ball.x = (cnv.width/2);
        ball.y = (cnv.height/2);
        ball.xv, ball.yv = 8;
    }
    if ( ball.y >= cnv.height || ball.y <= 0) {
        ball.yv = -ball.yv;
    }
}

function movePaddle(paddle) {//faire bouger les joueurs 
    let centerY = paddle.y + paddle.height/2;
    if ( centerY < ball.y - paddle.offset ) {
        paddle.y += 10;
    } 
    else if ( centerY > ball.y + paddle.offset ){
        paddle.y -= 10;
    }
}

function deltaY(paddle) {
    return ball.y - ( paddle.y + paddle.height / 2);
}

function hitPaddle(paddle) { //la ball tape bien contre les joueurs/PADDLE
    let aLeftOfB = (paddle.x + paddle.width) < (ball.x);
    let aRightOfB = (paddle.x) > (ball.x + ball.size);
    let aBoveB = (paddle.y + paddle.height) < (ball.y);
    let aBelowB = (paddle.y + paddle.height) < (ball.y);

    let collided = !(aLeftOfB || aRightOfB || aBoveB|| aBelowB);

    if(collided) {
        ball.xv = -ball.xv;
        ball.yv = deltaY(paddle) * 0.25;
    }
}