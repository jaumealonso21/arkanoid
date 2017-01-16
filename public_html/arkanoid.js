var w, h, ctx, canvas;
var pala, bloque, pilota;
var id, i, j, z, y;
var linBlock, levelBlock, colors, ent;
var rowBlock = [[10], [10], [10]]; // Array bidim amb colors dels blocks predefinits
var pos = [[10], [10], [10]]; // Array bidim amb pos. existència dels blocks

window.onload=Game();

function Game() {
    canvas = document.getElementById("game");
    w = canvas.width;
    h = canvas.height;
    pala = {x:(w/2)-14, y:h-8, amp:28, alc:2, score:0};
    pilota={x:50, y:75, dx:1, dy:1, mida:2, color:"red"};
    block = {x:0, y:5, amp:30, alc:10};//Primer block
    linBlock = 10; //Blocks per línia
    levelBlock = 2; //Nivells de blocks--El 0 compta
    colorsBlock(rowBlock); //Fixació dels colors, evita efecte psicodèlic
    
    ctx = canvas.getContext("2d");
    ctx.font = '12pt Calibri';
    ctx.fillStyle = "white";
    
    actualitza();
    document.addEventListener("keydown", escoltar, false);
    //id = window.requestAnimationFrame(actualitza);   
}
function colorsBlock(rowBlock) { 
    colors = ["#ff0000", "#00ff80", "#8000ff", "#4d88ff", "#80ffaa", "red", 
        "green", "violet", "cyan", "orange"];// 5 colors diferents
    y = 0; z = 0;
    for (y; y <= levelBlock; y++) {
        for (z; z <= linBlock; z++) {
            rowBlock[y][z] = colors[Math.floor(Math.random()*9)];//Color al.leatori(10)
            pos[y][z] = true; //Todos blocks existen al principio (opcional)
            //Més endavant fer-los random, pot ser??
        }
        z = 0; // Inici del comptador
    }
    y = 0; // Inici del comptador
}
function pintarBlocks(block) {
    //width/height canvas: 512px
    //marge dre/esq: 6 px; total w para blocks 500px -- Millor no marges
    //total blocks 512/64 = 10 blockscol
    // 3 línies de blocks, per exemple
    i = 0, j = 0;
    for(j; j <= levelBlock; j++) {
        for(i; i <= linBlock; i++) { //Fa una línia de Blocks 
            if(pos[j][i] === true) {
                ctx.fillStyle = rowBlock[j][i]; // Agafa dels colors predefinits
                ctx.fillRect(block.x, block.y, block.amp, block.alc);
            }
            block.x += block.amp;//Desplaçament a la pròxima posició
        }
        block.x = 0; //Tornar a posició horitzontal inicial
        i = 0; // Comptador a punt d'inici
        block.y += block.alc; //Desplaça una línia equiv. a l'alçada del block
        //console.log(j);
    }  
    block.x = 0; block.y = 5; //Posicions inicials del primer block
    ctx.fillStyle = "white"; // Evita que canviï el color de tots els elements del joc
}

function pintarPista(){ // No actiu
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
    ////Rebot al top del canvas
    if (pilota.y <= 0) { 
        pilota.dy = -pilota.dy;
        //Marca punt
        pala.score++;
    }
    //Rebot al bottom del canvas
    if (pilota.y >= h) { 
        pilota.dy = -pilota.dy;
        //Perd vida   
    }
    //Rebot parets laterals
    if (pilota.x >= w || pilota.x <= 0) { 
        pilota.dx = -pilota.dx;   
    }
    //Rebot Block
       
//    if (pilota.y <= 40 && pilota.y <= 30) { // Arribes a 3ºnivell
//        var t = 1;
//        for(t;t===linBlock;t++){
//            //ent = Math.floor(w/linBlock); //En quina pos.horitz. es troba la pilota
//            ent = w/(t*block.amp);
//            if(pilota.x>=w/t*block.amp && pilota.x<=w/(t+1)*block.amp){
//                if(pos[2][t] === true) {
//                    esborraBlock(2, t);
//                    pilota.dy = -pilota.dy;
//                }  
//            }   
//        }   
//    } else if(pilota.y <= 30 && pilota.y <= 20){ //Arribes a 2ºnivell
//        //pos[1][]
//    } else if(pilota.y <= 20 && pilota.y <= 10){ //Arribes 1ºnivell
//        //pos[0][]
//    }
         
    pintarPilota(pilota);	
}
function esborraBlock(y, z) {
    pos[y][z] = false; //Tocat per la pilota
    //Alternatiu per fer un 'score' més endavant
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

