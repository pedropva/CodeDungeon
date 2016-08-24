/**
 * Created by LAWS on 08/07/2016.
 */
 //um programa pra formatar o xml
var inventory = [];
var salaAtual = 0;//va guadar o id da sala em que o player ta 
var nSalas = 1;//guarda o numero de salas do xml
var xhttp = new XMLHttpRequest();
loadInventory(inventory);
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        carregaSala(xhttp);
    }else{
		//feedBackHistory("Erro ao conectar ao servidor!"); 
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
xhttp.open("GET", "http://pedropva.esy.es/rooms.xml", false);//aqui determina o carregamento assincrono
xhttp.send();


function nSala(){//bota no numero da sala no canto da div :)SERIA UMA BOA ESCREVER NO STATE ONDE ELE TA
   document.getElementById("roomNumber").innerHTML ="Sala: "+ parseInt(salaAtual+1);
}
function tutorial(){
	feedBackHistory("Olá! Bem vindo! Para começar a jogar primeiro voçe tem que aprender os comandos:");
	feedBackHistory("inventory ou i: Mostra o inventario atual do jogador(vc).");
	feedBackHistory("go <where>: Serve pra se movimentar entre as salas.");
	feedBackHistory("<where>: É pra onde ir,north/n,south/s,west/w e east/e.");
	feedBackHistory("look <where> ou <what>: Serve pra tentar prever o que vai ter na sala,cuidado ao entrar em salas que vc nao olhou primeiro!");
	feedBackHistory("<where>: É observar melhor, pode ser iten ou um desafio.");
	feedBackHistory("pick/take <what>: Com esse comando vc pega um iten selecionado!");
	feedBackHistory("drop <what>: Solta o iten do inventario no chao.");
	feedBackHistory("use <what> on <what>: Usa um iten em algum outro item,dentro do inventario ou nao, desde que o jogador esteja na sala daquele iten.");
}
function descriptionRoom(xml){//tem que mostrar as descriptions dos items tbm
	var xmlDoc = xml.responseXML;
 	document.getElementById("descriptionRoom").innerHTML = xmlDoc.getElementsByTagName("room")[salaAtual].getElementsByTagName("description")[0].childNodes[0].nodeValue;	
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
				seeInventory(xhttp);
				break;
			case "i":    	
				seeInventory(xhttp);
				break;
			case "drop":    	
				feedBackHistory("Isso nao ta implementado ainda nerdao!");
				drop(xhttp);
				break;
			case "use":    	
				feedBackHistory("Isso nao ta implementado ainda nerdao!");
				use(res[1],res[2],xhttp);
				break;
		    default:
		    	feedBackHistory("Isso nao faz sentido!");
		    	break;
	    }
	    
      	return false;
    }
}
function pick(what,xmlStatus){//pick TA DANDO ERRO ELE TA PEGANDO O ITEN ERRADO,OLHA ELE TEM QUE RECEBER O XML STATUS
	var active = isActive(what,xml);
	if(active != "alwaysTrue" ||  active != "false"){
		var xmlDoc = xmlStaus.responseXML;
		var items=xmlDoc.getElementsByTagName("item");
		for (var i = items.length - 1; i >= 0; i--){
			if(items[i].childNodes[0].nodeValue == what && items[i].getAttribute('where') == salaAtual){
				inventory[inventory.length]= items[i].childNodes[0].nodeValue;
				feedBackHistory("Pegou "+ what + "!");
			}
		}
	}else{
		feedBackHistory("Não dá consigo pegar isso!");
	}
}
function drop(xmlStatus){
	
}
function isActive(what,xmlStatus){//ELE RECEBE O XML STATUS
	var xmlDoc = xmlStatus.responseXML;
	var items = xmlDoc.getElementsByTagName("item");
	for (var i = items.length - 1; i >= 0; i--){
		if(items[i].getAttribute('id') == what){
			return items[i].getAttribute('active');
		}
	}
}
function seeInventory(xml){
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
			if(nextRoom.getElementsByTagName("north")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);				
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("tem nada pra frente");
			}
			break;
		case "south":
			if(nextRoom.getElementsByTagName("south")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("tem nada pra tras");
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("tem nada pra esquerda");
			}
			break;

		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("tem nada pra direita");
			}
			break;
		default:
			feedBackHistory("nao tem nada que valha a pena andar");
	}
}

function look(where,xml){//tem que descrever a proxima sala e funcionar pra ver a descricao do item
	var xmlDoc = xml.responseXML;
	var room = xmlDoc.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom")[0];
	switch(where){
		case "north": 
			if(nextRoom.getElementsByTagName("north")[0].childNodes.length > 0){//tem que aceitar tag vazia tbm 
				numberNext = nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				var next = xmlDoc.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription")[0].childNodes[0].nodeValue;
				feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '" escrito sobre ela.' + shortDescription);
			}else{
				feedBackHistory("nao tem nada a frente");
			}
			break;
		case "south":
			if(nextRoom.getElementsByTagName("south")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				var next = xmlDoc.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription")[0].childNodes[0].nodeValue;
				feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '"escrito sobre ela'+ shortDescription);
			}else{
				feedBackHistory("nao tem nada pra tras");
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				var next = xmlDoc.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription")[0].childNodes[0].nodeValue;
				feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '"escrito sobre ela'+ shortDescription);
			}else{
				feedBackHistory("nao tem nada pra esquerda");
			}
			break;
		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				var next = xmlDoc.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription")[0].childNodes[0].nodeValue;
				feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '"escrito sobre ela'+ shortDescription);
			}else{
				feedBackHistory("nao tem nada pra direita");
			}
			break;
		default:
			feedBackHistory("nao tem nada que valha a pena olhar ai");
	}
}
