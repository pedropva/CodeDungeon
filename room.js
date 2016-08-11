/**
 * Created by LAWS on 08/07/2016.
 */
 //um programa pra formatar o xml
var salaAtual = 0;//va guadar o id da sala em que o player ta 
var nSalas = 1;//guarda o numero de salas do xml
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        carregaSala(xhttp);
    }else{
		document.getElementById("descriptionRoom").innerHTML ="Erro ao conectar ao servidor!"; 
	}
};
function carregaSala(xhttp){
	nSala(xhttp);
	descriptionRoom(xhttp);	
}
xhttp.open("GET", "https://dl.dropboxusercontent.com/u/85412057/rooms.xml", false);
xhttp.send();


function nSala(){
   document.getElementById("roomNumber").innerHTML ="Sala: "+ parseInt(salaAtual+1);
}

function descriptionRoom(xml){
	var xmlDoc = xml.responseXML;
 	document.getElementById("descriptionRoom").innerHTML = xmlDoc.getElementsByTagName("descriptionRoom")[salaAtual].childNodes[0].nodeValue;	
}


document.getElementById('CommandInput').onkeypress = function(e) {
    var event = e || window.event;
    var charCode = event.which || event.keyCode;

    if ( charCode == '13' ) {
      	// Enter pressed
      	var texto;
	    texto = document.getElementById("CommandInput").value;
	    var res = texto.split(" ");
	    if(res[0] == "go"){
			go(res[1],xhttp);    
	    }
	 	if(res[0] == "look"){    	
			look(res[1],xhttp);
	    }   
      	return false;
    }
}
function pick(){

}
function take(){

}
function inventory(){

}
function use(){//serve tanto pra iten quanto pra terminal

}
function go(where,xml){
	var xmlDoc = xml.responseXML;
	var numberNext;
	var room = xmlDoc.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom")[0];
	switch(where){
		case "north":
			if(nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue != "none"){
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
			if(nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue != "none"){
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
			if(nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue != "none"){
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
			if(nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue != "none"){
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
			if(nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue != "none"){//tem que aceitar tag vazia tbm 
				numberNext = nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML ='Ha uma outra porta com "Sala' + numberNext[1] + '"escrito sobre ela, talvez devesse checar?';
			}else{
				document.getElementById("resposta").innerHTML = "nao tem nada a frente";
			}
			break;
		case "south":
			if(nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue != "none"){
				numberNext = nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML ='Ha uma outra porta com "Sala' + numberNext[1] + '"escrito sobre ela, talvez devesse checar?';
			}else{
				document.getElementById("resposta").innerHTML = "nao tem nada pra tras";
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue != "none"){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML ='Ha uma outra porta com "Sala' + numberNext[1] + '"escrito sobre ela, talvez devesse checar?';
			}else{
				document.getElementById("resposta").innerHTML = "nao tem nada pra esquerda";
			}
			break;
		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue != "none"){
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
