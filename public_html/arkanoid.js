//--------------------------------------ARKANOID--------------------------------
var w, h, ctx, canvas;
var pala, bloque, pilota;
var id, i, j, z, y;
var linBlock, levelBlock, ent, colors, marcador, punts;
var rowBlock = [[10], [10], [10]]; // Array bidim amb colors dels blocks predefinits
var pos = [[10], [10], [10]]; // Array bidim amb pos. existència dels blocks
var points = [[10], [10], [10]];// Array bidim amb puntuacions
var reinicio;//Funció que permet recarregar la pàgina

window.onload=Game();

function Game() {
    canvas = document.getElementById("game");
    w = canvas.width;
    h = canvas.height;
    pala = {x:(w/2)-14, y:h-8, amp:28, alc:2, score:0, vides:3};
    pilota = {x:w/2, y:45, dx:dirMov(), dy:0.5, mida:2, color:"red"};
    block = {x:0, y:5, amp:30, alc:10, point: 5};//Primer block
    linBlock = 10; //Blocks per línia
    levelBlock = 2; //Nivells de blocks--El 0 compta
    colors = ["yellow", "#00ff80", "#8000ff", "#4d88ff", "#80ffaa", "red", 
        "green", "violet", "cyan", "orange"];// 10 colors diferents
    punts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];//Puntuaciones amb els colors
    //Més endavant arreglar amb objecte mapa que contingui posicions, exist., colors i puntuacions-------------
    colorsBlock(rowBlock); //Fixació dels colors, evita efecte psicodèlic
    reinicio = function(){ window.location.reload(true); };
    marcador = 0;//Cada cop que es destrueix un bloc
    
    ctx = canvas.getContext("2d");
    ctx.font = '12pt Calibri';
    ctx.fillStyle = "white";//Color general
    
    actualitza();
    puntuaciones();//Crea la tabla de puntuacions a l'esquerra del canvas
    document.addEventListener("keydown", escoltar, false);//Mov pales
    id = window.requestAnimationFrame(actualitza);   
}
function dirMov(){
    var dir = [0.5, -0.5];//Escalable i sempre cap abaix
    return dir[Math.floor(Math.random()*2)];//Al.leatori dreta o esq
}
function colorsBlock(rowBlock) {
    y = 0; z = 0;
    for (y; y <= levelBlock; y++) {
        for (z; z <= linBlock; z++) {
            rowBlock[y][z] = colors[Math.floor(Math.random()*9)];//Color al.leatori(10)
            pos[y][z] = true; //Todos blocks existen al principio (opcional)
            points[y][z] = puntuacions(rowBlock[y][z]);//Assignació de punts depenent el color
            //Més endavant fer-los random
        }
        z = 0; // Inici del comptador
    }
    y = 0; // Inici del comptador
}
function puntuacions(p){ //Puntuacions per colors
    var sort;
    switch (p){
        case colors[0]: 
            sort =  punts[0];
            break;
        case colors[1]:
            sort = punts[1];
            break;
        case colors[2]:
            sort = punts[2];
            break;
        case colors[3]:
            sort = punts[3];
            break;
        case colors[4]:
            sort = punts[4];
            break;
        case colors[5]:
            sort = punts[5];
            break;
        case colors[6]:
            sort = punts[6];
            break;
        case colors[7]:
            sort = punts[7];
            break;
        case colors[8]:
            sort = punts[8];
            break;
        case colors[9]:
            sort = punts[9];
            break;
        default:
            sort = 0;
            break;
    }
    return sort;
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
    ctx.fillStyle = "white"; // Evita que canviï el color de tots els elements del joc(en general)
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
    ctx.restore();
}

function actualitzaPilota(pilota){
    pilota.x = pilota.x + pilota.dx; //Moviment de la pilota, en horitzontal
    pilota.y = pilota.y + pilota.dy; //Moviment de la pilota, en vertical
	
    //Rebot a la pala
    if(pilota.y >= (h-10) && (pilota.x >= pala.x && pilota.x <= (pala.x + pala.amp))) {
        pilota.dy = -pilota.dy;
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
        pala.vides--;
        //Reinici de la posició i moviment original de la pilota
        pilota.x = w/2;
        pilota.y = 45;
        pilota.dx = dirMov();//Al.leatori dreta o esq
        pilota.dy = 0.5;
    }
    //Rebot parets laterals
    if (pilota.x >= w || pilota.x <= 0) { 
        pilota.dx = -pilota.dx;   
    }
    //Rebot Block
    //if (pilota.y <= ((block.alc*(levelBlock+1))+block.y) && pilota.y >= (block.alc*levelBlock)+block.y) {//3º Nivell
    if(pilota.y === 35 || pilota.y === 25) { // Distància fixada  
       esborraBlock(levelBlock);//Els nivells comencen per 0
    }
    //if(pilota.y <= ((block.alc*levelBlock)+block.y) && pilota.y >= (block.alc*(levelBlock)-1)+block.y) {//2º Nivell
    if(pilota.y === 25 || pilota.y === 15) {//Arribes a 2ºnivell
        esborraBlock(levelBlock-1);
    }
    //if(pilota.y <= ((block.alc*(levelBlock)-1)+block.y) && pilota.y >= (block.alc*(levelBlock)-2)+block.y) {//1º Nivell
    if(pilota.y === 15 || pilota.y === 5) {//Arribes 1ºnivell
        esborraBlock(levelBlock-2);
    }
    
    pintarPilota(pilota);	
}

function esborraBlock(level) {
    ent = w/linBlock; //Divisions senceres de la línia de blocks
    var t = 0;
    for(t;t<=linBlock;t++){ //Tants com blocks horitzontals hi hagin 
        if(pilota.x>=ent*t && pilota.x<=(ent*t+ent)){//Passa per cada block horitzontal                 
            actualitzaBlock(level, t);
        }else if(pilota.x>=(ent*t-ent) && pilota.x<=ent*t){//Block lateral esquerra
            actualitzaBlock(level, t-1);
        }else if(pilota.x>=(ent*t+ent) && pilota.x<=(ent*t+ent*2)){//Block lateral dret
            actualitzaBlock(level, t+1);
        }
    }
}
function actualitzaBlock(level, t){//True-block existeix, False-block no existeix
    if(pos[level][t] === true) {//El block existeix
        pilota.dy = -pilota.dy;//Canvi de direcció
        pos[level][t] = false; //Tocat per la pilota, esborrat
        marcador += points[level][t];
    } 
}
function actualitzaMarcador(){
    ctx.save();
    ctx.textAlign = "center";
    //ctx.fillText(pala.score, w/2, 80);
    ctx.fillText(marcador, w/2, 80);
    ctx.restore();
}
function actualitzaVides(){
    ctx.save(); 
    if(pala.vides < 0){
        document.addEventListener("keydown", reinici, false);//Barra espai
        window.cancelAnimationFrame(id);//No para del tot, nomès ralentitza ???
        ctx.font = "1.5em Arial";
        ctx.textAlign = "center";
        ctx.fillText("Fi de la partida", w/2, h/2+25);
        ctx.fillText("Pulsa espai per reiniciar", w/2, h/2+45);
    }else{
        ctx.font = "5pt sans-serif";
        ctx.fillText("Vides: " + pala.vides, 2, 5);
    }
    ctx.restore();
}
function actualitza(timeStamp){
	ctx.clearRect(0, 0, w, h);
        pintarBlocks(block);
	pintarPala(pala);
	actualitzaPilota(pilota);
	actualitzaMarcador();
        actualitzaVides();
	id = window.requestAnimationFrame(actualitza);
}
function reinici(e){//Reinicia partida amb la tecla de la barra espai
    if(e.keyCode === 32){
        reinicio();
    }
}
function escoltar(e){
	//alert(e.keyCode);//Saber el codi de la tecla	
	if(e.keyCode === 37){ //fletxa esquerra
            if(pala.x >= 0){//Marge esquerra, passi la pala
                pala.x += -10;
            }	
	} else if(e.keyCode === 39){ //fletxa dreta
            if(pala.x <= (w-pala.amp)){//Marge dret menys amplada pala, passi la pala
                pala.x += +10;
            }	
	}
}

function puntuaciones(){
    var puntua = document.getElementById("puntuaciones");
    var tabla = document.createElement("table");
    puntua.appendChild(tabla);
    for(var x in colors){ 
        tabla.innerHTML += "<tr><td>Color: <span style='background-color: " + colors[x] + ";'>" + colors[x] + "</span></td><td> Puntuació: " + punts[x] + "</td></tr>\n";
    }
}
