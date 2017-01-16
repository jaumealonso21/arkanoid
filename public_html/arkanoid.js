var w, h, ctx, canvas;
var pala, bloque, pilota;
var id, i, j;
var linBlock, levelBlock, colors;

window.onload=Game();

function Game() {
    canvas = document.getElementById("game");
    w = canvas.width;
    h = canvas.height;
    pala = {x:(w/2)-14, y:h-8, amp:28, alc:2, score:0};
    pilota={x:50, y:25, dx:1, dy:1, mida:2, color:"red"};
    block = {x:0, y:5, amp:64, alc:10, display: true};//Primer block
    
    ctx = canvas.getContext("2d");
    ctx.font = '12pt Calibri';
    ctx.fillStyle = "white";
    
    actualitza();
    document.addEventListener("keydown", escoltar, false);
    //id = window.requestAnimationFrame(actualitza);   
}
function pintarBlocks(block) {
    //width/height canvas: 512px
    //marge dre/esq: 6 px; total w para blocks 500px -- Millor no marges
    //total blocks 512/64 = 10 blocks
    // 3 línies de blocks, per exemple
    linBlock = 10; //Blocks per línia
    levelBlock = 2; //Nivells de blocks--El 0 compta
    colors = ["#ff0000", "#00ff80", "#8000ff", "#4d88ff", "#80ffaa"];// 5 colors diferents
    i = 0, j = 0;
    for(j; j <= levelBlock; j++) {
        for(i; i <= linBlock; i++) { //Fa una línia de Blocks
            ctx.fillStyle = colors[Math.floor(Math.random()*5)];//Color al.leatori
            ctx.fillRect(block.x, block.y, block.amp, block.alc);
            block.x += 64;
        }
        block.x = 0; //Tornar a posició horitzontal inicial
        i = 0; // Comptador a punt d'inici
        block.y += block.alc; //Desplaça una línia equiv. a l'alçada del block
        //console.log(j);
    }  
    block.x = 0; block.y = 5; //Posicions inicials del primer block
    ctx.fillStyle = "white"; // Evita que canviï el color de tots els elements del joc
}

function pintarPista(){
    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(w/2, 0, 2, h); //-- Línia central
}
function pintarPala(pala) {
    ctx.fillRect(pala.x, pala.y, pala.amp, pala.alc);
}
function pintarPilota(p){
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.mida, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
    //ctx.stroke();
    //ctx.fillRect(p.x, p.y, p.mida, p.mida); -- Rectangle
    ctx.restore();
}

function actualitzaPilota(pilota){
    pilota.x = pilota.x + pilota.dx; //Moviment de la pilota, en horitzontal
    pilota.y = pilota.y + pilota.dy; //Moviment de la pilota, en vertical
	
    //Rebot a la pala
    if(pilota.y >= (h-10) && (pilota.x >= pala.x && pilota.x <= (pala.x + pala.amp))) {
        pilota.dy = -pilota.dy;
        //pilota.dx = -pilota.dx;
    }
    
    if (pilota.y <= 0) { //Rebot al top del canvas
        pilota.dy = -pilota.dy;
        //Marca punt
        pala.score++;
    }
    if (pilota.y >= h) { //Rebot al bottom del canvas
        pilota.dy = -pilota.dy;
        //Perd vida
        
    }
    
    if (pilota.x >= w || pilota.x <= 0) { //Rebot parets laterals
        pilota.dx = -pilota.dx;   
    } 
    pintarPilota(pilota);	
}
function actualitzaMarcador(){
	ctx.fillText(pala.score, (w/2), 80);	
}
function actualitza(timeStamp){
	ctx.clearRect(0, 0, w, h);
	//pintarPista(); -- Pinta dins el camp
        pintarBlocks(block);
	pintarPala(pala);
	actualitzaPilota(pilota);
	actualitzaMarcador();
	id = window.requestAnimationFrame(actualitza);
}
function escoltar(e){

	//alert(e.keyCode);
	
	if(e.keyCode === 37){ //fletxa esquerra
		pala.x += -10;
	}
	else if(e.keyCode === 39){ //fletxa dreta
		pala.x += +10;
	}

}

