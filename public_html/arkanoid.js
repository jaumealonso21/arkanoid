var w, h, ctx, canvas;
var pala, bloque, pilota;
var id;

window.onload=Game();

function Game() {
    canvas = document.getElementById("game");
    w = canvas.width;
    h = canvas.height;
    pala = {x:(w/2)-14, y:h-10, amp:28, alc:2, score:0};
    pilota={x:100, y:100, dx:1, dy:1, mida:3};
    
    ctx = canvas.getContext("2d");
    ctx.font = '15pt Calibri';
    ctx.fillStyle = "white";
    actualitza();
    document.addEventListener("keydown", escoltar, false);
    //id = window.requestAnimationFrame(actualitza);   
}

function pintarPista(){
    ctx.clearRect(0, 0, w, h);
    //ctx.fillRect(w/2, 0, 2, h); -- Línia central
}
function pintarPala(pala) {
    ctx.fillRect(pala.x, pala.y, pala.amp, pala.alc);
}
function pintarPilota(p){
    ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.mida, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
    //ctx.stroke();
    //ctx.fillRect(p.x, p.y, p.mida, p.mida); -- Rectangle
    ctx.restore();
}

function actualitzaPilota(){
    pilota.x = pilota.x + pilota.dx;
    pilota.y = pilota.y + pilota.dy;
	
    if (pilota.y<pala.y && pilota.y<(pala.y+28)){
         pilota.dx=-pilota.dx;
    }
	else if (pilota.x >= w) {
        pilota.dx=-pilota.dx;
         pala.score++;
    }
    else if (pilota.x <= 0){
	    pilota.dx=-pilota.dx;
	     
    }
    if (pilota.y >= h || pilota.y <= 0) {
	    pilota.dy=-pilota.dy;
	   
    }
    
    pintarPilota(pilota);
	
}
function actualitzaMarcador(){
	ctx.fillText(pala.score, (w/2)-16, 50);	
}
function actualitza(timeStamp){
	ctx.clearRect(0, 0, w, h);
	pintarPista();
	pintarPala(pala);
	actualitzaPilota();
	actualitzaMarcador();
	id = window.requestAnimationFrame(actualitza);
}
function escoltar(e){

	//alert(e.keyCode);
	
	if(e.keyCode === 37){
		pala.x += -10;
	}
	else if(e.keyCode === 39){
		pala.x += +10;
	}

}

