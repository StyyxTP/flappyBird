//board
let board;
//dimension du BG
let boardWidth = 360;
let boardHeight = 640;
let context;

//flappybird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdIMG;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//tuyaux
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeIMG;
let botPipeIMG;

//physique
let velocityX = -1;
let velocityY = 0;
let gravity = 0.05;

let gameOver = false;
let score = 0;

// définit la "taille" du jeu
window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 

    //affiche les images
    birdIMG = new Image();
    birdIMG.src = "assets/images/flappybird.png";
    birdIMG.onload = function(){
        context.drawImage(birdIMG, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeIMG = new Image();
    topPipeIMG.src ="assets/images/toppipe.png";

    botPipeIMG = new Image();
    botPipeIMG.src ="assets/images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1400); //toutes les 1.5s
    document.addEventListener("keydown", moveBird);

}


function update() {
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //oiseau
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdIMG, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    //tuyaux
    for (let i = 0; i< pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 1/2; // par ce que il y a 2 tuyaux
            pipe.passed = true
        }

        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //enlève les tuyaux qui ne sont plus affichés
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

    context.fillStyle = "black";
    context.font = "45px poppins"
    context.fillText(score, 5, 45);

    if (gameOver){
        context.fillText("Game Over", 5, 90);
    }

}

function placePipes() {
    if (gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeIMG,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let botPipe = {
        img : botPipeIMG,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(botPipe);
}

function moveBird(e) {
    if (e.code =="Space" || e.code == "ArrowUp"){
        //jump
        velocityY = -2.5 ;

        if (gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}