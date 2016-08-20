/**
 * Created by LAWS on 08/07/2016.
 */
 //um programa pra formatar o xml
var inventory = ["none","none"];
var salaAtual = 0;//va guadar o id da sala em que o player ta 
var nSalas = 1;//guarda o numero de salas do xml
var xhttp = new XMLHttpRequest();
loadInventory(inventory);
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        carregaSala(xhttp);
    }else{
		document.getElementById("descriptionRoom").innerHTML ="Erro ao conectar ao servidor!"; 
	}
};
function loadInventory(inventory){
	//testa se ja tem algum inventaro salvo
	//TODO esse teste ^
	//nao retorna nada se nao tiver
	return inventory
}

function carregaSala(xhttp){
	nSala(xhttp);
	descriptionRoom(xhttp);	
}
xhttp.open("GET", "https://dl.dropboxusercontent.com/u/85412057/rooms.xml", false);//aqui determina o carregamento assincrono
xhttp.send();


function nSala(){
   document.getElementById("roomNumber").innerHTML ="Sala: "+ parseInt(salaAtual+1);
}

function descriptionRoom(xml){//tem que mostrar as descriptions dos items tbm
	var xmlDoc = xml.responseXML;
 	document.getElementById("descriptionRoom").innerHTML = xmlDoc.getElementsByTagName("descriptionRoom")[salaAtual].childNodes[0].nodeValue;	
}
function CommandHistory(text) {
    var b = document.createElement("B");
    var br = document.createElement("br");
    var t = document.createTextNode(text);
    b.appendChild(t);
    document.getElementById("scrollDiv").appendChild(br);
    document.getElementById("scrollDiv").appendChild(b);
    updateScroll();
}
function feedBackHistory(text) {
    var b = document.createElement("i");
    var br = document.createElement("br");
    var t = document.createTextNode(text);
    b.appendChild(t);
    document.getElementById("scrollDiv").appendChild(br);
    document.getElementById("scrollDiv").appendChild(b);
    updateScroll();
}
function updateScroll(){
    var element = document.getElementById("scrollDiv");
    element.scrollTop = element.scrollHeight;
}

document.getElementById('CommandInput').onkeypress = function(e) {
    var event = e || window.event;
    var charCode = event.which || event.keyCode;

    if ( charCode == '13' ) {
      	// Enter pressed
      	var texto;
	    texto = document.getElementById("CommandInput").value;
	    CommandHistory(texto);
	    var res = texto.split(" ");
	    switch(res[0]){
	    	case "go":    
	    		switch(res[1]){
	    			case "n":
	    				res[1]="north";
	    				break;
	    			case "s":
	    				res[1]="south";
	    				break;
	    			case "w":
	    				res[1]="west";
	    				break;
	    			case "e":
	    				res[1]="east";
	    				break;
	    		}	
				go(res[1],xhttp);    
		 		break;
		 	case "look":    	
				look(res[1],xhttp);
				break;
			case "pick":    	
				pick(res[1],xhttp);
				break;
			case "take":    	
				pick(res[1],xhttp);
				break;
			case "inventory":    	
				inventory(xhttp);
				break;
			case "i":    	
				inventory(xhttp);
				break;
			case "use":    	
				use(res[1],res[2],xhttp);
				break;
		    default:
		    	feedBackHistory("Isso nao faz sentido!");
		    	break;
	    }
	    
      	return false;
    }
}//lembra de por historico de comandos e talz
function pick(what,xml){//pick
	var xmlDoc = xml.responseXML;
	CurRoom=xmlDoc.getElementsByTagName("room")[salaAtual];
	items=CurRoom.getElementsByTagName("items");
	for (var i = items.length - 1; i >= 0; i--) {
		if(items[0].childNodes[0].nodeValue == what){
			inventory[inventory.length]= items[0].childNodes[0].nodeValue;
		}
	}
}
function inventory(xml){
	var xmlDoc = xml.responseXML;
	feedBackHistory("Inventario: ");
	for (var i = inventory.length - 1; i >= 0; i--) {
		feedBackHistory(inventory[i]);
	}
}
function use(what,onWhat,xml){//serve tanto pra iten quanto pra terminal e inventario
	var xmlDoc = xml.responseXML;

}
function go(where,xml){//tem q por as siglas w,e,s,n
	var xmlDoc = xml.responseXML;
	var numberNext;
	var room = xmlDoc.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom")[0];
	switch(where){
		case "north":
			if(nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue != ""){
				numberNext = nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = "Entrando na sala "+numberNext[1];				
				salaAtual = parseInt(numberNext[1])-1;
				carregaSala(xhttp);
			}else{
				document.getElementById("resposta").innerHTML = "tem nada pra frente";
			}
			break;
		case "south":
			if(nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue != ""){
				numberNext = nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = "Entrando na sala "+numberNext[1];
				salaAtual = parseInt(numberNext[1])-1;
				carregaSala(xhttp);
			}else{
				document.getElementById("resposta").innerHTML = "tem nada pra tras";
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue != ""){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = "Entrando na sala "+numberNext[1];
				salaAtual = parseInt(numberNext[1])-1;
				carregaSala(xhttp);
			}else{
				document.getElementById("resposta").innerHTML = "tem nada pra esquerda";
			}
			break;

		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue != ""){
				numberNext = nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = "Entrando na sala "+numberNext[1];
				salaAtual = parseInt(numberNext[1])-1;
				carregaSala(xhttp);
			}else{
				document.getElementById("resposta").innerHTML = "tem nada pra direita";
			}
			break;
		default:
			document.getElementById("resposta").innerHTML = "nao tem nada que valha a pena andar";
	}
}

function look(where,xml){//tem que descrever a proxima sala e funcionar pra ver a descricao do item
	var xmlDoc = xml.responseXML;
	var room = xmlDoc.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom")[0];
	switch(where){
		case "north": 
			if(nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue != ""){//tem que aceitar tag vazia tbm 
				numberNext = nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML ='Ha uma outra porta com "Sala' + numberNext[1] + '"escrito sobre ela, talvez devesse checar?';
			}else{
				document.getElementById("resposta").innerHTML = "nao tem nada a frente";
			}
			break;
		case "south":
			if(nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue != ""){
				numberNext = nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML ='Ha uma outra porta com "Sala' + numberNext[1] + '"escrito sobre ela, talvez devesse checar?';
			}else{
				document.getElementById("resposta").innerHTML = "nao tem nada pra tras";
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue != ""){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML ='Ha uma outra porta com "Sala' + numberNext[1] + '"escrito sobre ela, talvez devesse checar?';
			}else{
				document.getElementById("resposta").innerHTML = "nao tem nada pra esquerda";
			}
			break;
		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue != ""){
				numberNext = nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML ='Ha uma outra porta com "Sala' + numberNext[1] + '"escrito sobre ela, talvez devesse checar?';
			}else{
				document.getElementById("resposta").innerHTML = "nao tem nada pra direita";
			}
			break;
		default:
			document.getElementById("resposta").innerHTML = "nao tem nada que valha a pena olhar ai";
	}
}
