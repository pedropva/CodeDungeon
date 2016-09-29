/**
 * Created by LAWS on 08/07/2016.
 */
//um programa pra formatar o xml
var items = [];//itens no chao
var inventory = [];// itens no inventario
var salaAtual = 0;//va guadar o index da sala em que o player ta ,nao o id o id começa de 1
var nSalas = 1;//guarda o numero de salas do xml
var xhttp = new XMLHttpRequest();
var xhttp2 = new XMLHttpRequest();
tutorial();
carregaTudo();
//connect();

function atualizaState(id,where,active){
	//http://stackoverflow.com/questions/14340894/create-xml-in-javascript
	//http://www.w3schools.com/xml/dom_nodes_create.asp
	xmlDoc = xhttp2.responseXML;
	
	newAtt = xmlDoc.createAttribute("where");
	//newAtt.nodeValue = items[0].getWhere();
	newAtt.nodeValue = "9999999";
	xmlDoc.getElementsByTagName("item")[0].setAttributeNode(newAtt);
	xmlDoc.getElementsByTagName("item")[0].setAttribute("where","11111111");
	feedBackHistory("salvou em: " + xmlDoc.getElementsByTagName("item")[0].getAttribute('id'));

	carregaTudo();
}

function item(id,where,active){//isso eh meio que uma classe...
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

	this.setId= function(id){
		this.id=id;
	}

	this.setWhere= function(where){
		this.where=where;
	}

	this.setActive= function(active){
		this.active=active;
	}
}

function carregaTudo(){
	carregaState();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			carregaSala(xhttp);
		}else{
			//feedBackHistory("Carregando...");  
		}
	};
	xhttp.open("GET", "rooms.xml", false);//aqui determina o carregamento assincrono
	xhttp.send();
}

function carregaState(){
	xhttp2.onreadystatechange = function() {
		if (xhttp2.readyState == 4 && xhttp2.status == 200) {
			loadGame(xhttp2);
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
	xhttp2.open("GET", "state.xml", false);//aqui determina o carregamento assincrono
	xhttp2.send();
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
	feedBackHistory("-use <what> on <what>: Usa um item em algum outro item,dentro do inventario ou nao, desde que o jogador esteja na sala daquele item.");
	feedBackHistory("Eh isso!Boa sorte!");
}

function descriptionRoom(xml){//por algum motivo,mesmo depois de desativado o item continua aparecendo :(
	var xmlDoc = xml.responseXML;
	var descriptionDroped="";
	var inventoryXML;
	inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];

	document.getElementById("descriptionRoom").innerHTML = xmlDoc.getElementsByTagName("room")[salaAtual].getElementsByTagName("description")[0].childNodes[0].nodeValue;	

	for (var i = items.length - 1; i >= 0; i--) {
		if(((items[i].getActive().indexOf("true") != -1) || (items[i].getActive() == ("alwaysTrue"))) && (items[i].getWhere() == (salaAtual+1))){
			for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
				if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id') == items[i].getId()){
					descriptionDroped = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("descriptionDroped")[0].childNodes[0].nodeValue;
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
	document.getElementById("scrollDiv").appendChild(b);
	document.getElementById("scrollDiv").appendChild(br);
	updateScroll();
}

function feedBackHistory(text) {
	var b = document.createElement("i");
	var br = document.createElement("br");
	var t = document.createTextNode(text);
	b.appendChild(t);
	document.getElementById("scrollDiv").appendChild(b);
	document.getElementById("scrollDiv").appendChild(br);
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
		texto=texto.toLowerCase();
		document.getElementById("CommandInput").value = "";
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
		case "ni":    	
			seeNotInventory();
			break;
		case "connect":    	
			connect(res[1]);
			break;
		case "drop":    	
			drop(res[1]);
			break;
		case "use":    	
			use(res[1],res[3],xhttp);//eu uso os indices 1 e 3 pq a sintaxe do cmoando é (use<what> on <what>) 
			break;
		default:
			feedBackHistory("Isso nao faz sentido!");
		break;
		}

		return false;
	}
}

function pick(what){
	for(var i = items.length - 1; i >= 0; i--){
		if(what.indexOf(items[i].getId()) != -1){
			if(items[i].getActive() == "true"){
				inventory[inventory.length] = items[i];
				items.splice(i, 1);
				feedBackHistory("Pegou "+ what + "!");
				inventory[inventory.length-1].setActive("false");
				descriptionRoom(xhttp);
				return;
			}else{
				feedBackHistory("Nao consigo pegar isso!");//tem no jogo mas n tem no inventario
				return;
			}
		}
	}
	feedBackHistory("Nao vejo nenhum item assim!");//n tem no jogo
}
//tem que pensar no awaysfalse
//inventory[i].getId() == what
//&& inventory[i].getWhere() == (salaAtual+1)
function drop(what){
	for(var i = inventory.length - 1; i >= 0; i--){
		if(what.indexOf(inventory[i].getId()) != -1 && inventory[i].getActive() == "false"){
			items[items.length] = inventory[i];
			inventory.splice(i, 1);
			feedBackHistory("Soltou "+ what + " na Sala "+ (salaAtual+1) +"!" );
			items[items.length-1].setActive("true");
			items[items.length-1].setWhere(salaAtual+1);
			descriptionRoom(xhttp);
			return;	
		}
	}
	feedBackHistory("Nao tenho nenhum item assim");//n tem no jogo
}

/*
	forzinho padrao pra consulta de items no inventario
	for(var i = inventory.length - 1; i >= 0; i--){
		if(what.indexOf(inventory[i].getId()) !== -1 && inventory[i].getActive() == "false" ){
			
			return;	
		}
	}
*/

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


function testaAt(at){
	for (var k = at.length - 1; k >= 0; k--) {
		if(at[k] == (parseInt(salaAtual)+1)){
			return 1;
		}
	}
	return 0;
}

function testaHas(has){
	for (var k = has.length - 1; k >= 0; k--) {
		for (var l = inventory.length - 1; l >= 0; l--) {
			if(has[k].indexOf(inventory[l].getId()) != -1){
				has[k] = 1;
				break; 
			}	
		}
		if(has[k] != 1){
			return 0;
		}
	}
	return 1;
}
function extract(what){
	for (var l = inventory.length - 1; l >= 0; l--) {
		if(inventory[l].getId().indexOf(what) != -1){
			items[inventory.length] = inventory[l];
			inventory.splice(l, 1);
			items[items.length-1].setWhere(salaAtual+1);
			feedBackHistory("Perdeu "+ what + "!");
			return;
		}
	}
}
function give(what){
	for(var i = items.length - 1; i >= 0; i--){
		if(what.indexOf(items[i].getId()) != -1){
			inventory[inventory.length] = items[i];
			items.splice(i, 1);
			feedBackHistory("Pegou "+ what + "!");
			inventory[inventory.length-1].setActive("false");
			descriptionRoom(xhttp);
			return;
		}
	}
}

function connect(what){
    var divPopup = document.createElement("DIV");
    divPopup.id = "overlay";
    var divCaixaResposta = document.createElement("DIV");
    divCaixaResposta.id = "caixaResposta";
    divPopup.style.width = "85%";
	divPopup.style.height = "85%";
    
    divPopup.appendChild(divCaixaResposta);
    document.getElementById("divPrincipal").appendChild(divPopup);
    $(document).ready(function(){
        $('#overlay, #overlay-back').fadeIn(500);                
    });

    //inserindo o blockly
    var blocklyDiv = document.createElement("DIV");
    blocklyDiv.id = "blocklyDiv";
    blocklyDiv.style.position= "absolute";
    blocklyDiv.style.width = "85%";
	blocklyDiv.style.height = "85%";
    document.getElementById("caixaResposta").appendChild(blocklyDiv);
  
   	//document.getElementById("caixaResposta").innerHTML += "<script src='blockly/blockly_compressed.js'></script><script src='blockly/blocks_compressed.js'></script>";
    //document.getElementById("caixaResposta").innerHTML += "<script src='blockly/msg/js/pt-br.js'></script>";
    //document.getElementById("caixaResposta").innerHTML += "<xml id='toolbox' style='display: none'><block type='controls_if'></block><block type='controls_repeat_ext'></block><block type='logic_compare'></block><block type='math_number'></block><block type='math_arithmetic'></block><block type='text'></block><block type='text_print'></block></xml>";
    //document.getElementById("caixaResposta").innerHTML += "<script>var workspace = Blockly.inject(\"blocklyDiv\",{toolbox: document.getElementById(\"toolbox\")});</script>";
  var workspace = Blockly.inject('blocklyDiv',
      {toolbox: document.getElementById('toolbox')});
    /*
    var s = document.createElement("script");
	s.type = "javascript";
	s.text = "<script>var workspace = Blockly.inject('blocklyDiv',{toolbox: document.getElementById('toolbox')});</script>";
	$("body").append(s);
    */
    //resizeBlockly();
}
function resizeBlockly(){
	var blocklyArea = document.getElementById('caixaResposta');//BlocklyArea = caixa resposta
  var blocklyDiv = document.getElementById('blocklyDiv');
  var workspace = Blockly.inject(blocklyDiv,{toolbox: document.getElementById('toolbox')});
  var onresize = function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
  };
  window.addEventListener('resize', onresize, false);
  onresize();
  Blockly.svgResize(workspace);
}

function use(what,onWhat,xml){//serve tanto pra iten quanto pra terminal e inventario
	var xmlDoc = xml.responseXML;
	//1-ve se as entradas do use sao validas:
	//2-tem que carregar as conditions
	//4 - faz os testes das conditions
	//5 - Se passou nos testes,carrega e executa os comandos basicos como print,drop,extract e give
	//6- Se necessario faz o DoSomething pra modificar um atributo de um item

	
	//elementos do DoSomething
	var victim;
	var property;
	var value;
	
	//condicoes
	var has = [];
	var at =[];
	
	//acoes
	//var print = [];//printa no feedback gistory
	//var drop = [];//DROPA UM ITEM
	//var give = []//tira do array de itens e bota no inventario;
	//var extract = []//tira do array do inventario e bota no de itens,E MANTEM O ITEM DESATIVADO, OU SEJA ELE TA NO CHAO MAS NAO EH DESCRITO NEM PODE SER PEGO PELO JOGADOR;
	
	var doSomething = [victim,property,value];//modifica uma propiedade de um item
	/*xml pra consulta:
	<use>
		<in what="bau">
			<condition>
				<has>chave</has>	
				<at>2</at>
			</condition>
			<action>
				<print>Voce abre o bau!Voçe achou um diamante solitario no fundo do bauzinho!</print>
				<give>diamond</give> 
				<extract>chave<extract>
				<do>
					<item>bau</item>
					<property>description</property>
					<value>Um bauzinho aberto</value>
				</do>
				<do>
					<item>diamond</item>
					<property>active</property>
					<value>false</value>
				</do>
			</action>
		</in>
	</use>
*/
	var inventoryXML;
	var conditions;
	var actions;

	inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];

	for(var i = inventory.length - 1; i >= 0; i--){
		if(what.indexOf(inventory[i].getId()) !== -1 && inventory[i].getActive() == "false" ){//achando o assassino que eu vou usar o use
			for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
				if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id').indexOf(inventory[i].getId()) != -1){//se i tem que eu uero usar eh o item no xml
					if(inventoryXML.getElementsByTagName("use")[j].childNodes.length > 0){//se a tag use ta vazia
						if(inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("in")[0].getAttribute('what').indexOf(onWhat) != -1){//achando a tag da vitima
							//feedBackHistory("achei! vitima= "+inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("in")[0].getAttribute('what') +" assassino= "+ inventory[i].getId());
							conditions = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("in")[0].getElementsByTagName("conditions")[0];
							actions = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("in")[0].getElementsByTagName("action")[0];
							


							//CARREGANDO AS CONDICOES
							for (var k = conditions.getElementsByTagName("has").length - 1; k >= 0; k--) {
								if(conditions.getElementsByTagName("has")[k].childNodes.length > 0){//se a tag use ta vazia
									has[k] = conditions.getElementsByTagName("has")[k].childNodes[0].nodeValue;
								}
							}
							for (var k = conditions.getElementsByTagName("at").length - 1; k >= 0; k--) {
								if(conditions.getElementsByTagName("at")[k].childNodes.length > 0){//se a tag use ta vazia
									at[k] = conditions.getElementsByTagName("at")[k].childNodes[0].nodeValue;
								}
							}


							//O TESTAO DAS CONDICOES
							if(testaHas(has)!=1){
								feedBackHistory("Eu nao tenho os itens necessarios pra usar isso!");
								return;
							}
							if(testaAt(at) != 1){
								feedBackHistory("Acredito que eu tenha que usar esses items em outro lugar");
								return;
							}

							//AS ACOES SE O USE FOR APROVADO
							//carrega e faz o print
							for (var k = actions.getElementsByTagName("print").length - 1; k >= 0; k--) {
								feedBackHistory(actions.getElementsByTagName("print")[k].childNodes[0].nodeValue);
							}
							//carrega e faz o give
							for (var k = actions.getElementsByTagName("give").length - 1; k >= 0; k--) {
								give(actions.getElementsByTagName("give")[k].childNodes[0].nodeValue);
							}
							//carrega e faz o extract
							for (var k = actions.getElementsByTagName("extract").length - 1; k >= 0; k--) {
								extract(actions.getElementsByTagName("extract")[k].childNodes[0].nodeValue);
							}
							//carrega e faz o drop
							for (var k = actions.getElementsByTagName("drop").length - 1; k >= 0; k--) {
								drop(actions.getElementsByTagName("drop")[k].childNodes[0].nodeValue);
							}
							//CARREGA O DO
							/*
							for (var k = actions.getElementsByTagName("do").length - 1; k >= 0; k--) {
								doSomething.victim = actions.getElementsByTagName("do")[k].getElementsByTagName("victim")[0].childNodes[0].nodeValue;
								doSomething.property = actions.getElementsByTagName("do")[k].getElementsByTagName("property")[0].childNodes[0].nodeValue;
								doSomething.value = actions.getElementsByTagName("do")[k].getElementsByTagName("value")[0].childNodes[0].nodeValue;
								
								for (var i = inventory.length - 1; i >= 0; i--) {
									if(inventory[i].getActive().indexOf("false") != -1 && inventory[i].getId().indexOf(victim) != -1){
										swtich(doSomething.property){
											case "id": 
												inventory[i].setId(doSomething.value);
												break;
											case "where": 
												inventory[i].setWhere(doSomething.value);
												break;
											case "active": 
												inventory[i].setActive(doSomething.value);
												break;
											default: 
								
												break;
										}
										return;
									}
								}
								for (i = items.length - 1; i >= 0; i--) {
									if(((items[i].getActive().indexOf("true") != -1) || (items[i].getActive() == ("alwaysTrue"))) && (items[i].getId() == (victim))){
										swtich(doSomething.property){
											case "id":
												items[i].setId(doSomething.value);
												break;
											case "where": 
												items[i].setWhere(doSomething.value);
												break;
											case "active": 
												items[i].setActive(doSomething.value);
												break;
											default: 

												break;
										}
										return;
									}
								}
							}
							*/
							return;
						}
					}
				}
			}
			feedBackHistory("Nao consigo usar esse item nisso");
			return;// o use so vai servir pra um unico item por vez,sendo que um item pode ter varios use(na vdd so um ,mas ele tem varios <in>), mas so vai executar um de cada vez
		}
	}
	feedBackHistory("Nao tenho nenhum item assim");//n tem no inventario ou n jogo
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

function look(where,xml){//o where tbm pode ser o nome do item, ver o dafault pro tratamento dos itens recebido
	var xmlDoc = xml.responseXML;
	var room = xmlDoc.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom")[0];
	var itemDescription;
	var inventoryXML;
	inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];
	switch(where){
		case "north": 
			if(nextRoom.getElementsByTagName("north")[0].childNodes.length > 0){//se a tag n ta vazia
				//http://stackoverflow.com/questions/10637467/prevent-javascript-from-breaking-when-xml-has-an-empty-node-value
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
				feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '"escrito sobre ela.'+ shortDescription);
			}else{
				feedBackHistory("nao tem nada pra tras");
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				var next = xmlDoc.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription")[0].childNodes[0].nodeValue;
				feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '"escrito sobre ela.'+ shortDescription);
			}else{
				feedBackHistory("nao tem nada pra esquerda");
			}
			break;
		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				var next = xmlDoc.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription")[0].childNodes[0].nodeValue;
				feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '"escrito sobre ela.'+ shortDescription);
			}else{
				feedBackHistory("nao tem nada pra direita");
			}
			break;
		default://tratamento de items,tem que ter tratamento pra quem ta fora do inventario tbm!
			for (var i = inventory.length - 1; i >= 0; i--) {
				if(inventory[i].getActive().indexOf("false") != -1){
					for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
						if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id') == inventory[i].getId()){
							itemDescription = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("description")[0].childNodes[0].nodeValue;							
							feedBackHistory(itemDescription); 
							return;
						}
					}
				}
			}
			for (i = items.length - 1; i >= 0; i--) {
				if(((items[i].getActive().indexOf("true") != -1) || (items[i].getActive() == ("alwaysTrue"))) && (items[i].getWhere() == (salaAtual+1))){
					for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
						if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id') == items[i].getId()){
							itemDescription = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("description")[0].childNodes[0].nodeValue;							
							feedBackHistory(itemDescription); 
							return;
						}
					}
				}
			}
			feedBackHistory("nao consigo observar nada assim.");
			break;
	}
}
