
const canvas = document.getElementById("demo-canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;


let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

function getRandomInit(min, max){
    return Math.round(Math.random() * (max - min)) + min;
}


// creacion particulas
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this. time = 0;
        this. ttl = 30;
    }

     

   // metodo de dibujo individual particulas
    draw() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();   
    }
    //check particle position,check mouse position,move the particle, draw the particle:comprobar la posición de la partícula, comprobar la posición del ratón, mover la partícula, dibujar la partícula
    update() {
        // // //check if particle is still winthin canvas:compruebe si la partícula todavía está dentro del lienzo
        if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
         }
        if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
        if(this.time<=this.ttl){
            this.size = 0;
        }
        this.time++;
        }

        //check collision detection - mouse position/ particle position:comprobar la deteccion de colisiones posicion del  mouse/posicion particulas
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        //move particle
        this.x += this.directionX;
        this.y += this.directionY;
        //draw particle
        this.draw();
    }
}
// create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 18000;
    for (let i = 0; i < numberOfParticles * 2; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = 'rgba(255,255,255,0.3)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

//check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(156,217,249,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
} 

// animation loop:bucle de animación
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}
//resize event:cambiar el tamaño del evento
window.addEventListener('resize',
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 70) * (canvas.height / 70));
        init();
    }
);

//mouse out event:evento mouse afuera
window.addEventListener('mouseout',
    function () {
        mouse.x = undefined;
        mouse.x = undefined;
    })


init();
animate();