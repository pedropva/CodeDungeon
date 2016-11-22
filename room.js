/**
 * Created by LAWS on 08/07/2016.
 */
 //include room2.ts
//um programa pra formatar o xml
var items = [];//itens no chao
var inventory = [];// itens no inventario
var monsters = [];
var roomsStates = [];
var blocks = [];//guarda o index da posicao de um bloco no inventario
var salaAtual = 0;//va guadar o index da sala em que o player ta ,nao o id o id começa de 1
var nSalas = 1;//guarda o numero de salas do xml
var xhttp = new XMLHttpRequest();
var xhttp2 = new XMLHttpRequest();
var workspace;
var myInterpreter = null;
var highlightPause = false;
var currentMonster='';//segura o monstro atual que esta em combate

//lista de blocos que o jogo aceita
var catLogic = ['if','compare','operation','negate','boolean','null','ternary'];
var catLoops = ['repeat','while','for','break'];
var catMath = ['number','arithmetic','single','trig','constant','change','round','list','modulo','constrain','randomInt','randomFloat'];
var catText = ['alert','submeter'];
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

function item(id,where,active,state){//isso eh meio que uma classe...
	this.id = id;
	this.where = where;
	this.active = active;
	this.state = state;

	this.getId= function(){
		return this.id;
	}

	this.getWhere= function(){
		return this.where;
	}

	this.getActive= function(){
		return this.active;
	}

	this.getState= function(){
		return this.state;
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
	this.setState= function(state){
		this.state=state;
	}
}

function monster(id,where,active,state){//isso eh meio que uma classe...
	this.id = id;
	this.where = where;
	this.active = active;
	this.state = state;
	

	
	this.getId= function(){
		return this.id;
	}

	this.getWhere= function(){
		return this.where;
	}

	this.getActive= function(){
		return this.active;
	}

	this.getState= function(){
		return this.state;
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

	this.setState= function(state){
		this.state=state;
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
	var statusXML = xmlDoc.getElementsByTagName("state")[0];
	
	var id ="";
	var where = "";
	var active ="";
	var state ="";

	salaAtual = parseInt(statusXML.getElementsByTagName("curRoom")[0].childNodes[0].nodeValue)-1;	
	
	//carrega os monstru
	var monsterr = statusXML.getElementsByTagName("monster");
	var itemm = statusXML.getElementsByTagName("item");
	var roomss = statusXML.getElementsByTagName("room");
	for(var i=0;i<monsterr.length;i++){
		id=	monsterr[i].getAttribute('id');
		where= monsterr[i].getAttribute('where');
		active= monsterr[i].getAttribute('active');
		state = monsterr[i].childNodes[0].nodeValue;
		monsters[i] = new monster(id,where,active,state);
	}
	
	//carreaga os item
	
	for(var i=0;i<itemm.length;i++){
		id=	itemm[i].getAttribute('id');
		where= itemm[i].getAttribute('where');
		active= itemm[i].getAttribute('active');
		state = itemm[i].childNodes[0].nodeValue;
		items[i] = new item(id,where,active,state);
	}
	// carrega as salas
	for(var i=0;i<roomss.length;i++){
		roomsStates[parseInt(roomss[i].getAttribute('id')-1)] =  roomss[i].childNodes[0].nodeValue;
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
	var roomss = xmlDoc.getElementsByTagName("rooms")[0];
	var rooms = roomss.getElementsByTagName("room");
	var inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];
	var bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
	var itemm = inventoryXML.getElementsByTagName("item");
	var monsterr = bestiaryXML.getElementsByTagName("monster");
	var descriptions;
	blocksManager();//atualiza o numero de blocos no vetor blocks pra saber quantos blocos o cara tem

	descriptions = rooms[salaAtual].getElementsByTagName("description");
	for (var i = descriptions.length - 1; i >= 0; i--){
		if(parseInt(descriptions[i].getAttribute('id')) == roomsStates[salaAtual]){
			document.getElementById("descriptionRoom").innerHTML = descriptions[i].childNodes[0].nodeValue;
			break;
		}
	}
	 
	//adiciona a descricao de items no chao
	for (var i = items.length - 1; i >= 0; i--) {
		if(((items[i].getActive() == "true") || (items[i].getActive() == ("alwaysTrue"))) && (items[i].getWhere() == (salaAtual+1))){
			for(var j=0;j < itemm.length ;j++){
				if(itemm[j].getAttribute('id') == items[i].getId()){
					descriptions = itemm[j].getElementsByTagName("descriptionDroped");
					for (var k = descriptions.length - 1; k >= 0; k--) {
						if(descriptions[k].getAttribute('id') == items[i].getState()){
							descriptionDroped = descriptions[k].childNodes[0].nodeValue;
							break;
						}
					}	
				}
			}
			document.getElementById("descriptionRoom").innerHTML += descriptionDroped;  
		}
	}
	//adiciona a descricao de monstros no chao
	for (var i = monsters.length - 1; i >= 0; i--) {
		if(((monsters[i].getActive() == "true" ) || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1))){			
			for(var j=0;j < monsterr.length ;j++){
				if(monsterr[j].getAttribute('id') == monsters[i].getId()){
					descriptions = monsterr[j].getElementsByTagName("shortDescription");
					if(descriptions[i].getAttribute('id') == monsters[i].getState()){
						descriptionDroped = descriptions[i].childNodes[0].nodeValue;
						connect(xhttp,monsters[i].getId());
						break;
					}
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
	if ( charCode == '13') {
		processInput(e);
	}
}
function processInput(e){	
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
	for (var i = inventory.length - 1; i >= 0; i--) {
		if(inventory[i].getId().indexOf(what) != -1){
			items[items.length] = inventory[i];
			inventory.splice(i, 1);
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

function disconnect(){
    $('#overlay, #overlay-back').fadeOut(500,function(){
		$(".blocklyTooltipDiv").remove();
		$(".blocklyWidgetDiv").remove();
		$(".overlay").remove();
		$(".toolbox").remove();
		document.getElementById('CommandInput').onkeypress = function(e) {
			var event = e || window.event;
			var charCode = event.which || event.keyCode;
			if ( charCode == '13') {
				processInput(e);
			}
		}
		document.getElementById('CommandInput').focus();
		updateScroll();
    });
}

function blocksManager(){//deve ser chamado sempre que se meche no inventario
	//atualiza o array blocks com os indexs dos blocos que o jogador tem
	var catLogic2 = catLogic.concat(catLoops);
	catLogic2 = catMath.concat(catLogic2);
	var existingBlocks =  catText.concat(catLogic2);
	blocks=[];//esvazia os blocos antes de atualizar
	for (var i = inventory.length - 1; i >= 0; i--) {
		for (var j = existingBlocks.length - 1; j >= 0; j--) {
			if(inventory[i].getId() == existingBlocks[j]){
				blocks[blocks.length] = i;
			}
		}
	}
}

function  toolboxManager(){
	var xmlDoc = xhttp.responseXML;
	var xmlDoc2 = xhttp2.responseXML;
	var inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];
	var itemm = inventoryXML.getElementsByTagName("item");
	var blocksXML='';//guarda uma string grandona com a tag use de cada bloco
	var logica='';
	var loops='';
	var matematica ='';
	var texto='';
	if(blocks.length == 0){
		alert('Não tem mais blocos para lutar!');
	}else{
		//adiciona ou retira os blocos da nova toolbox
		for (var i = blocks.length - 1; i >= 0; i--) {
			for (var j = itemm.length - 1; j >= 0; j--) {
				if(itemm[j].getAttribute('id') == inventory[blocks[i]].getId()){
					//tem que testar se ele nao inicia uma categoria nova
					for (var k = catLogic.length - 1; k >= 0; k--) {
						if(catLogic[k] == itemm[j].getAttribute('id')){
							logica+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 			
						}
					}
					for (var k = catLoops.length - 1; k >= 0; k--) {
						if(catLoops[k] == itemm[j].getAttribute('id')){
							loops+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 			
						}
					}
					for (var k = catMath.length - 1; k >= 0; k--) {
						if(catMath[k] == itemm[j].getAttribute('id')){
							matematica+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 			
						}
					}
					for (var k = catText.length - 1; k >= 0; k--) {
						if(catText[k] == itemm[j].getAttribute('id')){
							texto+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 
						}
					}
				}
			}
		}
		if(logica!=''){
			logica='<category id="catLogic" colour="210" name="Logic">'+logica+'</category>';
		}
		if(loops!=''){
			loops='<category id="catLoops" colour="120" name="Loops">'+loops+'</category>';
		}
		if(matematica!=''){
			matematica='<category id="catMath" colour="230" name="Math">'+matematica+'</category>';
		}
		if(texto!=''){
			texto='<category id="catText" colour="160" name="Text">'+texto+'</category>';
		}
		blocksXML +=logica+loops+matematica+texto+'<sep></sep><category id="catVariables" colour="330" custom="VARIABLE" name="Variables"></category>'; 
		blocksXML=replaceBrakets(blocksXML);
		//cria a toolbox se ela ainda nao existir e sobreescreve ela se ja existir
		if(document.getElementById("toolbox") != null){
			document.getElementById('toolbox').innerHTML = blocksXML;
		}else{
			var code = '<xml id="toolbox" class="toolbox" style="display: none">'+blocksXML+'</xml>';
			document.body.innerHTML+= code;
		}
	}
}
function replaceBrakets(code){
	code = code.split('');
	result="";
	for (var i = 0; i <= code.length - 1; i++) {
		if(code[i] == '['){
			code[i]= '<';
		}else if(code[i] == ']'){
			code[i] = '>';
		}
		result+=code[i];
	}
	return result;
}
function connect(xml,what){
	toolboxManager();//atualiza os blocos que o cara tem
	currentMonster=what;
	var xmlDoc = xml.responseXML;
    bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
    var monsterr = bestiaryXML.getElementsByTagName("monster");
    connected = false;
    chalenge = "";
    //carregando o desafio do xml
    for (var i = monsters.length - 1; i >= 0; i--) {
  		if(((monsters[i].getActive().indexOf("true") != -1) || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1) && monsters[i].getId().indexOf(what) != -1)){			
  			for (var j = monsterr.length - 1; i >= 0; i--){	  				
  				if(monsterr[j].getAttribute("id") == monsters[i].getId()){
  					chalenge ="\t"+monsterr[j].getElementsByTagName("problem")[0].childNodes[0].nodeValue;
  					connected = true;
  				}
  			}
  		}
	}
	//criando as divs
	if(connected == true){
	    if(document.getElementById("overlay") == null && document.getElementById("toolbox") != null){//testa se o blockly ainda n foi injetado e se a toolbox n ta vazia
	    	//criando a div 
	    	var divPopup = document.createElement("DIV");
		    divPopup.id = "overlay";
		    divPopup.className = "overlay";
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
		    blocklyDiv.className = "blocklyDiv";
		    blocklyDiv.style.position= "absolute";
		    blocklyDiv.style.width = "45%";
			blocklyDiv.style.height = "95%";
		    document.getElementById("caixaResposta").appendChild(blocklyDiv);

		    //inserindo a div do script
		    var codeDiv = document.createElement("DIV");
		    codeDiv.id = "codeDiv";
			codeDiv.innerHTML += "<div id=\"chalenge\" class=\"chalenge\"></div>";
			codeDiv.innerHTML += "<div id=\"code\" class=\"code\"></div>";
			codeDiv.innerHTML += "<div id=\"result\" class=\"result\"></div>";
		    codeDiv.innerHTML += "<select id=\"languageDropdown\" class=\"languageDropdown\" onchange=\"updateCode();\"><option value=\"JavaScript\">JavaScript</option><option value=\"Python\">Python</option><option value=\"PHP\">PHP</option><option value=\"Lua\">Lua</option><option value=\"Dart\">Dart</option></select>";
		 
		    document.getElementById("caixaResposta").appendChild(codeDiv);
		  	
		  	document.getElementById('result').innerHTML='Resultado:';
		  	document.getElementById("codeDiv").innerHTML += "<input type=\"submit\" id=\"btnStep\" value=\"Step\" onclick=\"stepCode();\">"
		  	document.getElementById("codeDiv").innerHTML += "<input type=\"submit\" id=\"btnParse\" value=\"Parse\" onclick=\"parseCode();\">"
		   	document.getElementById("codeDiv").innerHTML += "<input type=\"submit\" id=\"btnRun\" value=\"Run\" onclick=\"runCode();\">"
		   	document.getElementById('btnStep').disabled = 'disabled';
		   	document.getElementById("btnStep").style.backgroundColor = "#4d4d4d";

		   	workspace = Blockly.inject('blocklyDiv',
		    {toolbox: document.getElementById('toolbox'),
		     zoom:
		         {controls: true,
		          wheel: true,
		          startScale: 1.0,
		          maxScale: 3,
		          minScale: 0.3,
		          scaleSpeed: 1.2},
		     trashcan: true});
		   	
		  	workspace.addChangeListener(updateCode);
			
			document.getElementById("result").innerHTML += "<pre id=resultPre></pre>";
			document.getElementById("chalenge").innerHTML += "Desafio:";
			document.getElementById("chalenge").innerHTML += "<pre id=chalengePre></pre>";
			document.getElementById("chalengePre").innerHTML += chalenge;
			updateCode();
		}
	}
}
function updateCode(event) {
	var languageDropdown = document.getElementById('languageDropdown');
    var languageSelection = languageDropdown.options[languageDropdown.selectedIndex].value;
	var code = Blockly[languageSelection].workspaceToCode(workspace);
	code = "<br>Código:<br><pre id=\"codePre\">"+replaceCommand(code,'highlight')+"</pre>";
  	document.getElementById('code').innerHTML = code;
}
function runCode2(){
	document.getElementById('btnStep').disabled = 'disabled';
	document.getElementById('btnParse').disabled = 'disabled';
	document.getElementById('btnRun').disabled = 'disabled';
	var code = Blockly.JavaScript.workspaceToCode(workspace);
	var myInterpreter = new Interpreter(code,initApi);
	myInterpreter.run();
	document.getElementById('btnStep').disabled = '';
	document.getElementById('btnParse').disabled = '';
	document.getElementById('btnRun').disabled = '';
}

function initApi(interpreter, scope) {
  // Add an API function for the alert() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(alert(text));
  };
  interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the prompt() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(prompt(text));
  };
  interpreter.setProperty(scope, 'prompt',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for highlighting blocks.
  var wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(scope, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));
}

function highlightBlock(id) {
  workspace.highlightBlock(id);
  highlightPause = true;
}

function parseCode() {
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  var code = Blockly.JavaScript.workspaceToCode(workspace);

  code = comentaRapidao(code,'submeter');
  myInterpreter = new Interpreter(code, initApi);

  document.getElementById('btnStep').disabled = '';
  document.getElementById("btnStep").style.backgroundColor = "#a6a6a6";
  document.getElementById('btnRun').disabled = 'disabled';
  document.getElementById("btnRun").style.backgroundColor = "#4d4d4d";
  highlightPause = false;
  workspace.traceOn(true);
  workspace.highlightBlock(null);
}

function stepCode() {
	var code2 = Blockly.JavaScript.workspaceToCode(workspace); 
	try {
		var ok = myInterpreter.step();
    	}finally {
    	if (!ok) {
    		// Program complete, no more code to execute.
	    	document.getElementById('resultPre').innerHTML='';
	    	var para = document.createElement('script');
	    	code2 = replaceCommand(code2,'imprimir');
			code2 = comentaRapidao(code2,'alert');
			code2 = comentaRapidao(code2,'highlight');
			var t = document.createTextNode(code2);      // Create a text node
			para.appendChild(t);   
			document.head.appendChild(para);
			testaResultado();
      
        	document.getElementById('btnStep').disabled = 'disabled';
        	document.getElementById("btnStep").style.backgroundColor = "#4d4d4d";
        	document.getElementById('btnRun').disabled = '';
        	document.getElementById("btnRun").style.backgroundColor = "#a6a6a6";
        	return;
        }
  	}
	if (highlightPause) {
    	// A block has been highlighted.  Pause execution here.
 		highlightPause = false;
	} else {
    	// Keep executing until a highlight statement is reached.
    	stepCode();
	}
}

function runCode() {
	document.getElementById('btnStep').disabled = 'disabled';
	document.getElementById('btnParse').disabled = 'disabled';
	document.getElementById('btnRun').disabled = 'disabled';
    var code2 = Blockly.JavaScript.workspaceToCode(workspace);
    var code=comentaRapidao(code2,'imprimir');
    code = comentaRapidao(code,'highlight');
    var initFunc = function(interpreter, scope) {
      var alertWrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(alert(text));
      };
      interpreter.setProperty(scope, 'alert',
          interpreter.createNativeFunction(alertWrapper));
      var promptWrapper = function(text) {
        text = text ? text.toString() : '';
        return interpreter.createPrimitive(prompt(text));
      };
      interpreter.setProperty(scope, 'prompt',
          interpreter.createNativeFunction(promptWrapper));
    };
    var myInterpreter = new Interpreter(code, initFunc);
    var stepsAllowed = 10000;
    while (myInterpreter.step() && stepsAllowed) {
      stepsAllowed--;
    }
    if (!stepsAllowed) {
       alert('Erro: Loop Infinito.');
       
       //return;
    }else{
    	document.getElementById('resultPre').innerHTML='';
    	var para = document.createElement('script');
    	code2 = replaceCommand(code2,'imprimir');
		code2 = comentaRapidao(code2,'alert');
		code2 = comentaRapidao(code2,'highlight');
		var t = document.createTextNode(code2);      // Create a text node
		para.appendChild(t);   
		document.head.appendChild(para);
		testaResultado();
    }
    document.getElementById('btnStep').disabled = '';
	document.getElementById('btnParse').disabled = '';
	document.getElementById('btnRun').disabled = '';
}
function testaResultado(){
	var xmlDoc = xhttp.responseXML;
    bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
    var monsterr = bestiaryXML.getElementsByTagName("monster");
    chalenge = "";
    //carregando o desafio do xml
    for (var i = monsters.length - 1; i >= 0; i--) {
  		if(((monsters[i].getActive().indexOf("true") != -1) || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1) && monsters[i].getId().indexOf(currentMonster) != -1)){			
  			for (var j = monsterr.length - 1; i >= 0; i--){	  				
  				if(monsterr[j].getAttribute("id") == monsters[i].getId()){
  					chalenge =monsterr[j].getElementsByTagName("test")[0].childNodes[0].nodeValue;//carrega o TESTE E NAO O PROBLEMA
  				}
  			}
  		}
	}
	if(document.getElementById('resultPre').innerHTML == chalenge){
		alert('Resposta certa!');
		currentMonster='';
		disconnect();
	}else{
		alert('Resposta errada!');
	}
	
}
function replaceCommand(code,what){
	var i=0;
	var j=0;
	var aux='';
	var newCode=[];
	newCode[0] = '';
	while(i<code.length){
		newCode[j]+=code[i];
		if((code[i] == ';' || code[i] == '{' || code[i] == '}') && code[i+1]== '\n'){
			//newCode[j]+='\0'
			j++;
			newCode[j]='';
		}
		i++;
	}
	for (var i = newCode.length - 1; i >= 0; i--) {
		if(what == 'imprimir'){
			if(newCode[i].includes('imprimir(')){
				var value='';
				for(var k=newCode[i].indexOf('(');k<newCode[i].indexOf(')');k++){
					value += newCode[i][k];
				}
				newCode[i] = '\ndocument.getElementById("resultPre").innerHTML+='+value+');';

			}	
		}else if(what == 'highlight'){
			if(newCode[i].includes('highlightBlock(')){
				newCode[i] ='';
			}
		}		
	}
	for (var i = 0; i < newCode.length - 1; i++) {
		aux+=newCode[i];
	}
	return aux;
}
function comentaRapidao(code,what){3
	var i=0;
	var j=0;
	var aux='';
	var newCode=[];
	newCode[0] = '';
	while(i<code.length){
		newCode[j]+=code[i];
		if(code[i] == ';' || code[i] == '{' || code[i] == '}' || code[i]== '\n'){
			//newCode[j]+='\0'
			j++;
			newCode[j]='';
		}
		i++;
	}
	for (var i = newCode.length - 1; i >= 0; i--) {
		if(what == 'imprimir'){
			if(newCode[i].includes('imprimir(')){
				newCode[i] ='//'+newCode[i];
			}	
		}else if(what == 'alert'){
			if(newCode[i].includes('alert(')){
				newCode[i] ='//'+newCode[i];
			}
		}else if(what == 'highlight'){
			if(newCode[i].includes('highlightBlock(')){
				newCode[i] ='//'+newCode[i];
			}
		}		
	}
	for (var i = 0; i < newCode.length - 1; i++) {
		aux+=newCode[i];
	}
	//alert(aux);
	return aux;
}
function use(what,onWhat,xml){//serve tanto pra iten quanto pra terminal e inventario
	var xmlDoc = xml.responseXML;
	//1-ve se as entradas do use sao validas:
	//2-tem que carregar as conditions
	//4 - faz os testes das conditions
	//5 - Se passou nos testes,carrega e executa os comandos basicos como print,drop,extract e give
	//6- Se necessario faz o DoSomething pra modificar um atributo de um item

	//seria bom mudar o currroom
	
	//condicoes
	var has = [];
	var at =[];
	
	//acoes
	//var print = [];//printa no feedback gistory
	//var drop = [];//DROPA UM ITEM
	//var give = []//tira do array de itens e bota no inventario;
	//var extract = []//tira do array do inventario e bota no de itens,E MANTEM O ITEM DESATIVADO, OU SEJA ELE TA NO CHAO MAS NAO EH DESCRITO NEM PODE SER PEGO PELO JOGADOR;
	

	//elementos do DoSomething
	var victim;
	var property;
	var value;
	
	var doSomething = [victim,property,value];//modifica uma propiedade de um item

	var inventoryXML;
	var conditions;
	var actions;
	var computed = false;

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

							for (var k = actions.getElementsByTagName("do").length - 1; k >= 0; k--) {
								doSomething.victim = actions.getElementsByTagName("do")[k].getElementsByTagName("victim")[0].childNodes[0].nodeValue;
								doSomething.property = actions.getElementsByTagName("do")[k].getElementsByTagName("property")[0].childNodes[0].nodeValue;
								doSomething.value = actions.getElementsByTagName("do")[k].getElementsByTagName("value")[0].childNodes[0].nodeValue;

								//feedBackHistory("Carregado o DO,com as seguintes caracteristicas: "+"Vitima: "+doSomething.victim +" Property: "+ doSomething.property +" Value: "+ doSomething.value);
								//mudando as caracteristicas de um item no inventario
								computed = false;
								for (var l = inventory.length - 1; l >= 0; l--){
									if((inventory[l].getActive().indexOf("false") == 0) && (inventory[l].getId().indexOf(doSomething.victim) == 0)){
										switch(doSomething.property){
											case "where": 
												inventory[l].setWhere(doSomething.value);
												break;
											case "active": 
												inventory[l].setActive(doSomething.value);
												break;
											case "state": 
												inventory[l].setState(doSomething.value);
												break;
											default: 
												break;
										}
										//feedBackHistory("Item modificado: "+inventory[l].getId()+" where: "+ inventory[l].getWhere() +" Active: "+ inventory[l].getActive() + " State: "+ inventory[l].getState());
										computed = true;
										break;
									}
								}
								//mudando as caracteristicas de um item no chao
								if(computed != true ){
									for (l = items.length - 1; l >= 0; l--) {
										if(((items[l].getActive().indexOf("true") == 0) || (items[l].getActive() == ("alwaysTrue"))) && (items[l].getId() == (doSomething.victim))){
											switch(doSomething.property){
												case "where": 
													items[l].setWhere(doSomething.value);
													break;
												case "active": 
													items[l].setActive(doSomething.value);
													break;
												case "state": 
													items[l].setState(doSomething.value);
													break;
												default: 
													break;
											}
											//feedBackHistory("Item modificado: "+items[l].getId()+" where: "+ items[l].getWhere() +" Active: "+ items[l].getActive() + " State: "+ items[l].getState());
											computed = true;
											break;
										}
									}
									if(computed != true){
										//mudando as caracteristicas de um monstro, no chao (é claro)
										for (l = monsters.length - 1; l >= 0; l--) {
											if(monsters[l].getId() == (doSomething.victim)){
												switch(doSomething.property){
													case "where": 
														monsters[l].setWhere(doSomething.value);
														break;
													case "active": 
														monsters[l].setActive(doSomething.value);
														break;
													case "state": 
														monsters[l].setState(doSomething.value);
														break;
													default: 
														break;
												}
												//feedBackHistory("Item modificado: "+monsters[l].getId()+" where: "+ monsters[l].getWhere() +" Active: "+ monsters[l].getActive() + " State: "+ monsters[l].getState());
												computed = true;
												break;
											}
										}
										if(computed = true){
											//mudando as caracteristicas de um quarto
											for (l = roomsStates.length - 1; l >= 0; l--) {
												//alert("teste do room");
												if(parseInt(doSomething.victim) != NaN){
													if(doSomething.property == "state"){
														roomsStates[parseInt(doSomething.victim)-1] = doSomething.value;
														//feedBackHistory("Sala modificada: "+parseInt(doSomething.victim));
														break;
													}
												}
											}
										}
									}
								}
							}
							//alert("fim do DO");
							carregaSala(xhttp)
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
	var roomm = xmlDoc.getElementsByTagName("rooms")[0];
	var room = roomm.getElementsByTagName("room")[salaAtual];
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

	var roomm = xmlDoc.getElementsByTagName("rooms")[0];
	var room = roomm.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom")[0];
	var itemDescription;
	var inventoryXML;
	inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];
	var bestiaryXML;
	bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
	switch(where){
		case "north": 
			if(nextRoom.getElementsByTagName("north")[0].childNodes.length > 0){//se a tag n ta vazia
				//http://stackoverflow.com/questions/10637467/prevent-javascript-from-breaking-when-xml-has-an-empty-node-value
				numberNext = nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				var next = roomm.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription");
				var roomStatus = roomsStates[parseInt(numberNext)-1];
				for (var i = shortDescription.length - 1; i >= 0; i--) {
					if(shortDescription[i].getAttribute('id') == roomStatus){
						feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '" escrito sobre ela.' + shortDescription[i].childNodes[0].nodeValue);
					}
				}
			}else{
				feedBackHistory("nao tem nada a frente");
			}
			break;
		case "south":
			if(nextRoom.getElementsByTagName("south")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				var next = roomm.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription");
				var roomStatus = roomsStates[parseInt(numberNext)-1];
				for (var i = shortDescription.length - 1; i >= 0; i--) {
					if(shortDescription[i].getAttribute('id') == roomStatus){
						feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '" escrito sobre ela.' + shortDescription[i].childNodes[0].nodeValue);
					}
				}
			}else{
				feedBackHistory("nao tem nada pra tras");
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				var next = roomm.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription");
				var roomStatus = roomsStates[parseInt(numberNext)-1];
				for (var i = shortDescription.length - 1; i >= 0; i--) {
					if(shortDescription[i].getAttribute('id') == roomStatus){
						feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '" escrito sobre ela.' + shortDescription[i].childNodes[0].nodeValue);
					}
				}
			}else{
				feedBackHistory("nao tem nada pra esquerda");
			}
			break;
		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				var next = roomm.getElementsByTagName("room")[parseInt(numberNext)-1];
				var shortDescription = next.getElementsByTagName("shortDescription");
				var roomStatus = roomsStates[parseInt(numberNext)-1];
				for (var i = shortDescription.length - 1; i >= 0; i--) {
					if(shortDescription[i].getAttribute('id') == roomStatus){
						feedBackHistory('Ha uma outra porta com "Sala' + numberNext + '" escrito sobre ela.' + shortDescription[i].childNodes[0].nodeValue);
					}
				}
			}else{
				feedBackHistory("nao tem nada pra direita");
			}
			break;
		default://tratamento de items,tem que ter tratamento pra quem ta fora do inventario tbm e tbm dos monstros!
			var itemStatus;
			var descriptions;

			//itens no inventario
			for (var i = inventory.length - 1; i >= 0; i--) {
				if(inventory[i].getActive().indexOf("false") != -1 && inventory[i].getId().indexOf(where) != -1){
					itemStatus = inventory[i].getState();
					for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
						if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id') == inventory[i].getId()){
							descriptions = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("description");
							for (var k = descriptions.length - 1; k >= 0; k--) {
								if(descriptions[k].getAttribute('id') == itemStatus){
									feedBackHistory("coisa1");
									feedBackHistory(descriptions[k].childNodes[0].nodeValue); 
									return;
								}
							}		
						}
					}
				}
			}
			//items no chao
			for (i = items.length - 1; i >= 0; i--) {
				if(((items[i].getActive().indexOf("true") != -1) || (items[i].getActive() == ("alwaysTrue"))) && (items[i].getWhere() == (salaAtual+1)) && items[i].getId().indexOf(where) != -1){
					itemStatus = items[i].getState();
					for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
						if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id') == items[i].getId()){
							descriptions = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("description");
							for (var k = descriptions.length - 1; k >= 0; k--) {
								if(descriptions[k].getAttribute('id') == itemStatus){
									feedBackHistory("coisa2");
									feedBackHistory(descriptions[k].childNodes[0].nodeValue); 
									return;
								}
							}	
						}
					}
				}
			}
			//monstros
			for (i = monsters.length - 1; i >= 0; i--) {
				if(((monsters[i].getActive().indexOf("true") != -1) || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1) && monsters[i].getId().indexOf(where) != -1)){
					itemStatus = monsters[i].getState();
					for(var j=0;j < bestiaryXML.getElementsByTagName("monster").length ;j++){
						if(bestiaryXML.getElementsByTagName("monster")[j].getAttribute('id') == monsters[i].getId()){
							descriptions = bestiaryXML.getElementsByTagName("monster")[j].getElementsByTagName("description");
							for (var k = descriptions.length - 1; k >= 0; k--) {
								if(descriptions[k].getAttribute('id') == itemStatus){
									feedBackHistory(descriptions[k].childNodes[0].nodeValue); 
									return;
								}
							}	
						}
					}
				}
			}
			feedBackHistory("nao consigo observar nada assim.");
			break;
	}
}

 function limpaString(coisa){
 	var novaCoisa='';

 	coisa = coisa.toLowerCase();
 	var j = 0;
 	for (var i = 0; i < coisa.length - 1; i++) {
 		
 		switch(coisa[i]){
 			case ',':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '.':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '0':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '1':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '2':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '3':
				novaCoisa[j] += coisa[i];
 				j++; 				
 				break;
 			case '4':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '5':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '6':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '7':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '8':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case '9':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'a':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'b':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'c':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'd':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'e':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'f':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'g':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'h':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'i':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'j':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'k':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'l':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'm':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'n':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'o':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'p':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'q':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'r':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 's':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 't':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'u':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'v':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'w':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'x':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'y':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			case 'z':
 				novaCoisa[j] += coisa[i];
 				j++;
 				break;
 			default:
 				break;
 		}
 	}
 	return novaCoisa;
 }