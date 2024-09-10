var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const fullscreenButton = document.getElementById("fullscreenButton");
const gameOverSound = new Audio("GameoverPac.mp4");

///i can def remove most of these...am i gonna no

const LiveTX = canvas.width / 10;
const LiveTY = canvas.height / 10;
const PointTX = canvas.width / 3;


let pacManX = canvas.width / 2;
let pacManY = canvas.height / 1.2;
let direction = '';
let points = 0;
let lives = 3;
let pacspeed = 5;
//this is just so the sound playes once
let onceCheck=0;

const powerBalls = [
    { x: 30, y: 150, radius: 20, color: "orange" },
    { x: canvas.width - 30, y: 150, radius: 20, color: "orange" },
    { x: 30, y: canvas.height - 150, radius: 20, color: "orange" },
    { x: canvas.width - 30, y: canvas.height - 150, radius: 20, color: "orange" }
];

function drawBall(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}


const pacManDots = createPacManDots();

function PacManDot(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
}


function createPacManDots() {
    const dots = [];
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 5;
        const color = "yellow";
        const dot = { x, y, radius, color };
        dots.push(dot);
    }
    return dots;
}



////// THE GHOST SCARY

class Ghost {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x + this.size >= canvas.width) {
            this.velX = -Math.abs(this.velX);
        }

        if (this.x - this.size <= 0) {
            this.velX = Math.abs(this.velX);
        }

        if (this.y + this.size >= canvas.height) {
            this.velY = -Math.abs(this.velY);
        }

        if (this.y - this.size <= 0) {
            this.velY = Math.abs(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }
}

const Ghosts = [];
const ghostDetails = [
  { x: 100, y: 100, velX: 5, velY: 5, color: "red", size: 25 },
  { x: 200, y: 200, velX: -7, velY: -13, color: "pink", size: 8 },
  { x: 300, y: 300, velX: 10, velY: -10, color: "orange", size: 10 },
  { x: 400, y: 400, velX: -13, velY: 7, color: "cyan", size: 12 }
];

for (const detail of ghostDetails) {
  const ghost = new Ghost(detail.x, detail.y, detail.velX, detail.velY, detail.color, detail.size);
  Ghosts.push(ghost);
}
function drawPowerBalls() {
    powerBalls.forEach(ball => {
        drawBall(ball.x, ball.y, ball.radius, ball.color);
    });
}
function drawPacMan() {
    const radius = 20;
    let startAngle, endAngle;
    const angle = Math.PI / 180;

    switch (direction) {
        case 'down':
            startAngle = angle * 120;
            endAngle = angle * 420;
            break;
        case 'up':
            startAngle = angle * 300;
            endAngle = angle * 600;
            break;
        case 'left':
            startAngle = angle * 210;
            endAngle = angle * 510;
            break;
        case 'right':
            startAngle = angle * 30;
            endAngle = angle * 330;
            break;
        default:
            startAngle = angle * 30;
            endAngle = angle * 330;
            break;
    }

    ctx.beginPath();
    ctx.arc(pacManX, pacManY, radius, startAngle, endAngle, false);
    ctx.lineTo(pacManX, pacManY);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    let eyeX = pacManX + 10;
    let eyeY = pacManY - 10;
    if (direction === 'left') {
        eyeX = pacManX - 6;
    } else if (direction === 'right') {
        eyeX = pacManX + 6;
    } else if (direction === 'up') {
        eyeY = pacManY - 6;
    } else if (direction === 'down') {
        eyeY = pacManY - 6;
    }
    ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2, true);
    ctx.fill();
}



///THE DRAWS TEXT
function drawLiveText() {
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = "white"
    ctx.fillText("Lives:"+lives, LiveTX, LiveTY);
}
function drawGameOver() {
    ctx.font = '100px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = "white"
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.width / 4);
    onceCheck++
    if (onceCheck===1) {
    gameOverSound.play();
    }
}

function drawPointText() {
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Points:"+ points, PointTX, LiveTY);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            alert("Error: can't enter fullscreen mode: " + err.message);
        });
    } else {
        document.exitFullscreen();
    }
}

/// TOUCHING
function touchingDot(dot) {
    let dx = pacManX - dot.x;
    let dy = pacManY - dot.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let sumOfRadii = dot.radius + 20;

    if (distance < sumOfRadii) {
        return true;
    }
    return false;
}
function touchingGhost(ghost) {
    let dx = pacManX - ghost.x;
    let dy = pacManY - ghost.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let sumOfRadii = ghost.size + 20; 

    if (distance < sumOfRadii) {
        return true;
    }
    return false;
}
function touchingPower(power) {
    let dx = pacManX - power.x;
    let dy = pacManY - power.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let sumOfRadii = power.radius + 20;

    if (distance < sumOfRadii) {
        return true;
    }
    return false;
}




function draw() {
    if (lives<=0)
        {drawGameOver();}
    else
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLiveText();
    drawPointText();
    drawPowerBalls();
    
    Ghosts.forEach(ghost => {
        ghost.draw();
        ghost.update();
    });


    // TOUCHING IN DRAW
    for (let i = pacManDots.length - 1; i >= 0; i--) {
        const dot = pacManDots[i];
        drawBall(dot.x, dot.y, dot.radius, dot.color);
        
        if (touchingDot(dot)) {
            pacManDots.splice(i, 1);
            points++
        }
    }
    Ghosts.forEach((ghost) => {
        if (touchingGhost(ghost)) {
            lives--;
            pacManX = canvas.width / 2;
            pacManY = canvas.height / 1.2;
        }
    });
    powerBalls.forEach((power, index) => {
        drawBall(power.x, power.y, power.radius, power.color);
        
        if (touchingPower(power)) {
            pacspeed+=5;
            powerBalls.splice(index, 1);
        }
    });

    // keeps going fron last keypress
    const radius = 20;
    switch (direction) {
        case 'up':
            if (pacManY - pacspeed > radius) { pacManY -= pacspeed;
            } else {pacManY = radius;}
            break;
        case 'down':
            if (pacManY + pacspeed < canvas.height - radius) {pacManY += pacspeed;
            } else {pacManY = canvas.height - radius;}
            break;
        case 'right':
            if (pacManX + pacspeed < canvas.width - radius) {pacManX += pacspeed;
            } else {pacManX = canvas.width - radius;}
            break;
        case 'left':
            if (pacManX - pacspeed > radius) {pacManX -= pacspeed;
            } else { pacManX = radius;}
            break;
        default:
            break;
    }
    
    drawPacMan();

    requestAnimationFrame(draw);
}

fullscreenButton.addEventListener('click', toggleFullscreen);
draw();



// if touch sets a direction
document.addEventListener('keydown', function(event) {
    switch (event.key.toLowerCase()) {
        case 'w':
            direction = 'up';
            break;
        case 's':
            direction = 'down';
            break;
        case 'a':
            direction = 'left';
            break;
        case 'd':
            direction = 'right';
            break;
    }
});

let touchStartX = 0;
let touchStartY = 0;
const minSwipeDistance = 30; 
window.addEventListener('touchstart', function (e) {
    // Capture the initial position when the touch starts
    touchStartX = e.changedTouches[0].pageX;
    touchStartY = e.changedTouches[0].pageY;
}, false);

window.addEventListener('touchmove', function (e) {
    e.preventDefault(); // This prevents scrolling during swipe
}, { passive: false });

window.addEventListener('touchend', function (e) {
    // Get the position where the touch ends
    const touchEndX = e.changedTouches[0].pageX;
    const touchEndY = e.changedTouches[0].pageY;

    const xDiff = touchEndX - touchStartX;
    const yDiff = touchEndY - touchStartY;

    // Determine the direction based on the magnitude of x and y differences
    if (Math.abs(xDiff) > minSwipeDistance || Math.abs(yDiff) > minSwipeDistance) {
        if (xDiff > 0) {
            direction = 'right';
        } else {
            direction = 'left';
        }
    } else { // Vertical movement
        if (yDiff > 0) {
            direction = 'down';
        } else {
            direction = 'up';
        }
    }
});
