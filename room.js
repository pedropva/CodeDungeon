/**
 * Created by LAWS on 08/07/2016.
 */
//um programa pra formatar o xml
var items = [];
var inventory = [];
var salaAtual = 0;//va guadar o index da sala em que o player ta ,nao o id o id começa de 1
var nSalas = 1;//guarda o numero de salas do xml
var xhttp = new XMLHttpRequest();
var xhttp2 = new XMLHttpRequest();
tutorial();
carregaTudo();

function atualizaState(){
	xmlDoc = xhttp2.responseXML;
	newAtt = xmlDoc.createAttribute("where");
	newAtt.nodeValue = items[0].getWhere();
	xmlDoc.getElementsByTagName("item")[0].setAttributeNode(newAtt);
}

function item(id,where,active){
	this.id = id;
	this.where = where;
	this.active = active;

	this.getInfo = function() {
		return this.color + ' ' + this.type + ' apple';
	};
	this.getId= function(){
		return this.id;
	}

	this.getWhere= function(){
		return this.where;
	}

	this.getActive= function(){
		return this.active;
	}

	this.setId= function(){
		this.id=id;
	}

	this.setWhere= function(){
		this.where=where;
	}

	this.setActive= function(){
		this.active=active;
	}
}

function carregaTudo(){
	xhttp2.onreadystatechange = function() {
		if (xhttp2.readyState == 4 && xhttp2.status == 200) {
			loadGame(xhttp2);
		}else{
			//feedBackHistory("Erro ao conectar ao servidor!"); 
		}
	};
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			carregaSala(xhttp);
		}else{
			//cria o arquivo de save
			function test(){    
				var v = new  XMLWriter();
				v.writeStartDocument(true);
				v.writeElementString('test','Hello World');
				v.writeAttributeString('foo','bar');
				v.writeEndDocument();
				console.log( v.flush() );
			} 
		}
	};
	//testa se ja tem algum inventaro salvo
	//TODO esse teste ^
	xhttp2.open("GET", "http://pedropva.esy.es/state.xml", false);//aqui determina o carregamento assincrono
	xhttp2.send();
	xhttp.open("GET", "http://pedropva.esy.es/rooms.xml", false);//aqui determina o carregamento assincrono
	xhttp.send();
}
function loadGame(xml){
	var xmlDoc = xml.responseXML;
	salaAtual = parseInt(xmlDoc.getElementsByTagName("curRoom")[0].childNodes[0].nodeValue)-1;	
	for(var i=0;i<xmlDoc.getElementsByTagName("item").length;i++){
		var id=	xmlDoc.getElementsByTagName("item")[i].getAttribute('id');
		var where= xmlDoc.getElementsByTagName("item")[i].getAttribute('where');
		var active= xmlDoc.getElementsByTagName("item")[i].getAttribute('active');
		items[i] = new item(id,where,active);
	}
}

function carregaSala(xhttp){
	nSala(xhttp);
	descriptionRoom(xhttp);	
}


function nSala(){//bota no numero da sala no canto da div :)
	document.getElementById("roomNumber").innerHTML ="Sala: "+ parseInt(salaAtual+1);
}

function tutorial(){
	feedBackHistory("Ola! Bem vindo! Para comecar a jogar primeiro voce tem que aprender os comandos:");
	feedBackHistory("-inventory ou i: Mostra o inventario atual do jogador(vc).");
	feedBackHistory("-go <where>: Serve pra se movimentar entre as salas.");
	feedBackHistory("-<where>: Eh pra onde ir,north/n,south/s,west/w e east/e.");
	feedBackHistory("-look <where> ou <what>: Serve pra tentar prever o que vai ter na sala,cuidado ao entrar em salas que vc nao olhou primeiro!");
	feedBackHistory("-<where>: Eh observar melhor, pode ser iten ou um desafio.");
	feedBackHistory("-pick/take <what>: Com esse comando vc pega um item selecionado!");
	feedBackHistory("-drop <what>: Solta o item do inventario no chao.");
	feedBackHistory("-use <what> on <what>: Usa um item em algum outro item,dentro do inventario ou nao, desde que o jogador esteja na sala daquele iten.");
	feedBackHistory("Eh isso!Boa sorte!");
}
function descriptionRoom(xml){//tem que mostrar as descriptions dos items tbm
	var xmlDoc = xml.responseXML;
	var descriptionDroped="";
	document.getElementById("descriptionRoom").innerHTML = xmlDoc.getElementsByTagName("room")[salaAtual].getElementsByTagName("description")[0].childNodes[0].nodeValue;	
	for(var i=0;i<items.length-1;i++){
		if(items[i].getActive() == "true" && items[i].getWhere() == (salaAtual+1)){
			feedBackHistory("tentei1");
			for(var j=0;j<xmlDoc.getElementsByTagName("item").lenght;j++){
				if(xmlDoc.getElementsByTagName("item")[j].getAttribute('id') == items[i].getId()){
					descriptionDroped = xmlDoc.getElementsByTagName("item")[j].getElementsByTagName("descriptionDroped")[0].childNodes[0].nodeValue;
					feedBackHistory(desriptionDroped);
				}
			}
			document.getElementById("descriptionRoom").innerHTML += descriptionDroped;  
		}
	}
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
			pick(res[1]);
			break;
		case "take":    	
			pick(res[1]);
			break;
		case "inventory":    	
			seeInventory();
			break;
		case "i":    	
			seeInventory();
			break;
		case "Ni":    	
			seeNotInventory();
			break;
		case "drop":    	
			drop(res[1]);
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
function pick(what){//ele n ta checando se existe
	var active = isActive(what);
	if(active != "naoTem" &&  active != "false"){
		if(active != "alwaysTrue"){
			for(var i = items.length - 1; i >= 0; i--){
				if(items[i].getId() == what && items[i].getWhere() == (salaAtual+1)){
					inventory[inventory.length]= items[i];
					items.splice(i, 1);
					feedBackHistory("Pegou "+ what + "!");
				}
			}
		}else{
			feedBackHistory("Nao consigo pegar isso!");
		}
	}else{
		feedBackHistory("Nao vejo nenhum item assim!");
	}
}
//tem que pensar no awaysfalse
function drop(what){
	var active = isInInventory(what);
	if(active != "naoTem" &&  active == "false"){
		if(active == "alwaysTrue"){
			for(var i = inventory.length - 1; i >= 0; i--){
				if(inventory[i].getId() == what && inventory[i].getWhere() == (salaAtual+1)){
					items[items.length]= inventory[i];
					inventory.splice(i, 1);
					feedBackHistory("Soltou "+ what + "!");
				}
			}
		}else{
			feedBackHistory("Nao consigo deixar isso!");
		}
	}else{
		feedBackHistory("Nao tenho nenhum item assim");
	}	
}

function isInInventory(what){
	for(var i = inventory.length - 1; i >= 0; i--){
		feedBackHistory(what);
		feedBackHistory(inventory[i].getId());
		if(inventory[i].getId().equals(what)){
			return inventory[i].getActive();
		}
	}
	return "naoTem";
}

function isActive(what){
	for (var i = items.length - 1; i >= 0; i--){
		if(items[i].getId() == what){
			return items[i].getActive();
		}
	}
	return "naoTem";
}

function seeInventory(){
	feedBackHistory("Inventario: ");
	for (var i = inventory.length - 1; i >= 0; i--) {
		feedBackHistory(inventory[i].getId());
	}
}
function seeNotInventory(){
	feedBackHistory("Chao: ");
	for (var i = items.length - 1; i >= 0; i--) {
		feedBackHistory(items[i].getId());
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
