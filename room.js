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
xhttp.open("GET", "https://dl.dropboxusercontent.com/u/85412057/room1.xml", false);
xhttp.send();


function nSala(){
   document.getElementById("roomNumber").innerHTML ="Sala: "+ parseInt(salaAtual+1);
}

function descriptionRoom(xml){
	var xmlDoc = xml.responseXML;
 	document.getElementById("descriptionRoom").innerHTML = xmlDoc.getElementsByTagName("descriptionRoom")[salaAtual].childNodes[0].nodeValue;	
}

function act(){
    var texto;
    texto = document.getElementById("CommandInput").value;
    var res = texto.split(" ");
    if(res[0] == "go"){
		go(res[1],xhttp);    
    }
 	if(res[0] == "look"){    	
		look(res[1],xhttp);
    }   
}


function go(where,xml){
	var xmlDoc = xml.responseXML;
	var numberNext;
	var room = xmlDoc.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom")[0];
	switch(where){
		case "foward":
			if(nextRoom.getElementsByTagName("foward")[0].childNodes[0].nodeValue != "none"){
				numberNext = nextRoom.getElementsByTagName("foward")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = numberNext[1];				
				salaAtual = parseInt(numberNext[1])-1;
				carregaSala(xhttp);
			}else{
				document.getElementById("resposta").innerHTML = "tem nada pra frente";
			}
			break;
		case "back":
			if(nextRoom.getElementsByTagName("back")[0].childNodes[0].nodeValue != "none"){
				numberNext = nextRoom.getElementsByTagName("back")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = numberNext[1];
				salaAtual = parseInt(numberNext[1])-1;
				carregaSala(xhttp);
			}else{
				document.getElementById("resposta").innerHTML = "tem nada pra tras";
			}
			break;
		case "left":
			if(nextRoom.getElementsByTagName("left")[0].childNodes[0].nodeValue != "none"){
				numberNext = nextRoom.getElementsByTagName("left")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = numberNext[1];
				salaAtual = parseInt(numberNext[1])-1;
				carregaSala(xhttp);
			}else{
				document.getElementById("resposta").innerHTML = "tem nada pra esquerda";
			}
			break;

		case "right":
			if(nextRoom.getElementsByTagName("right")[0].childNodes[0].nodeValue != "none"){
				numberNext = nextRoom.getElementsByTagName("right")[0].childNodes[0].nodeValue;
				numberNext = numberNext.split(" ");
				document.getElementById("resposta").innerHTML = numberNext[1];
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

function look(where,xml){
	var xmlDoc = xml.responseXML;
	switch(where){
		case "foward": 
			document.getElementById("resposta").innerHTML = "tem nada em frente";
			break;
		case "back":
			document.getElementById("resposta").innerHTML = "tem nada pra atras";
			break;
		case "left":
			document.getElementById("resposta").innerHTML = "tem nada pra esquerda";
			break;
		case "right":
			document.getElementById("resposta").innerHTML = "tem nada pra direita";
			break;
		default:
			document.getElementById("resposta").innerHTML = "nao tem nada que valha a pena olhar ai";
	}
}
