/**
 * Created by Pedro Vinicius Almeida de Freitas-LAWS-UFMA on 08/07/2016.
 */
var curGame='';//guarda qual jogo está rodando no momento
var gamesDone = [];// lista de strings com os titulos dos jogos terminados (a ser substituida pelo bd)
var ppmk ='0';//player primey key
var playerID = '';
var dbplayerStatus='';// status do bd
var dbitensStatus='';// status dos itens
var dbmonstersStatus='';// status dos mosnters
var dbroomsStatus='';// status dos rooms
var items = [];//itens no chao
var inventory = [];// itens no inventario
var monsters = [];
var roomsStates = [];//guarda os states das salas recebe como argumento salaAtual, assim roomsStates[salaAtual] = "2";
var blocks = [];//guarda o index da posicao de um bloco no inventario,gerado automaticamente a partir dos dados do inventario
var salaAtual = 0;//va guadar o index da sala em que o player ta 
var http = new XMLHttpRequest();//xhttp do menu
var xhttp = new XMLHttpRequest();//xhttp do jogo escolhido
var workspace=null;//variaveis importantes do blockly
var myInterpreter = null;//variaveis importantes do blockly
var highlightPause = false;//variaveis importantes do blockly
var currentMonster='';//segura o monstro atual que esta em combate, só fica cheio enquanto em batalha, não é necessario salvar.
var finalRoom;//guarda o numero da ultima sala, tbm n precisa salvar, é sempre carregado do xml
var carregado=false; //guarda se a pagina e o jogo foram carregados com sucesso
var lastMove=0;//guarda o index do final do ultimo movimento, inicio conta com o index do tutorial!
//lista de blocos que o jogo aceita
var catLogic = ['se','compare','operation','negate','boolean','null','ternary'];
var catLoops = ['repetir','enquanto','contar','break'];
var catMath = ['matematica','number','arithmetic','single','trig','constant','change','round','list','modulo','constrain','randomInt','randomFloat'];
var catText = ['alerta','imprimir','ler'];
var blocksHad =[];//guarda os blocos já obtidos, para que o tutorial não se repita
var blocksTutorial =[];//vetor auxiliar pra saber quais blocos estão na pilha para serem apresentados no tutorial quando a janela der fade-in
var rest='../codedungeon/restserver/api/';
var login='login/';
var user='users/';
var user_itens='user_itens/';
var user_rooms='user_rooms/';
var user_monsters='user_monsters/';
var user_logs='logs/';
//tutorial
tutorialAux();
function showTutorial(){
	criaJanela("tutorial");
	tutorial();
	fadeJanela("fadebackground");
}
//loadGames();DESCOMENTE PARA CARREGAMENTO DO MENU DE XMLS
carregaTudo('tutorial.xml');//DESCOMENTECOMENTE PARA CARREGAMENTO DIRETO DO TUTORIAL
function loadGames(){
	//carrega games.xml
    http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			loadMenu(http);
		}else{
			//feedBackHistory("Carregando...");  
		}
	};
	http.open("GET", "xmls/games.xml", true);//aqui determina o carregamento assincrono
	http.send();
}

//menu de seleção de jogos:
function loadMenu(http){
	curGame='';
	var xmlDoc = http.responseXML;
    //if(document.getElementById("overlay") == null){
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

    	var numberOfColumns = 5;
	    var games = xmlDoc.getElementsByTagName("game");
	    var divIns = document.createElement("DIV");
	    var divMenu = document.createElement("DIV");
	    var table = document.createElement("TABLE");
	    var actualRow;
	    var status = "disabled";
	    var iRow = 0;
	    table.className = "tableMenu";
	    divIns.className = "title";
	    divMenu.className = "menu";
	    divMenu.appendChild(divIns);
	    for(i = 0; i<games.length; i++){
	        var status = "disabled";
	        if(i%numberOfColumns == 0) actualRow = table.insertRow(iRow++);
	        if(games[i].getElementsByTagName("unlock")[0].childNodes.length > 0){// ve se tem algum requisito
		        for (var j = gamesDone.length - 1; j >= 0; j--) {     	
		        	if(games[i].getElementsByTagName("unlock")[0].childNodes[0].nodeValue == gamesDone[j]) status = "";		//ve se o jogador tem esse requisito	
		        }
	        }else{
	        	status = "";
	        }
	        actualRow.insertCell(i%numberOfColumns).innerHTML = "<button onclick = \"carregaTudo(\'"+games[i].getElementsByTagName("path")[0].childNodes[0].nodeValue+"\');\" class = \"menuQuestion\" "+status+">"+games[i].getAttribute('id')+"</button>";
	    }
	    divMenu.appendChild(table);
	    divIns.innerHTML = "Selecione um jogo:";    
	    document.getElementById("caixaResposta").innerHTML = "";
	    document.getElementById("caixaResposta").appendChild(divMenu);
	    $(document).ready(function(){
	    	$('#overlay, #overlay-back').fadeIn(500);                
		});
	//}else{
	//}
}
//outras funcoes do jogo(BD):
function saveUser(){
	//user data:
	$.ajax({
	  url: rest+user,
	  type: 'PUT',
	  data: "fok_current_room="+salaAtual+"&pmk_user="+ppmk,
	  success: function(data) {
	  	  //console.log("salvou o maluco!");
	  }
	});
	//blocksHad data	
}

function loadUser(){
	//user data:
	//Tenta conectar com o servidor
	$.get(rest+login, function(pk, dbstatus){
		ppmk=pk;
        if(dbstatus == 'success'){
			$.get(rest+user+ppmk, function(data, dbstatus){
				dbplayerStatus = dbstatus;
				salaAtual = parseInt(data[0].fok_current_room);
				playerID = data[0].user_name;
				if(salaAtual==0)showTutorial();
				//blocksManager();//atualiza o numero de blocos no vetor blocks pra saber quantos blocos o cara tem
				//itens data
				loadItens();
				//monster data
				loadMonsters();
				//rooms data
				loadRooms();
				//blocksHad data
				//carregaSala(xhttp);
		    });
		}else{
			console.log('ue,não conseguiu conectar ao servidor!');
			console.log('Motivo: '+dbstatus);
		}
    });
}
function saveIten(what,action){
	var position=-1;
	var active=0;//guarda a traducao false=N true=Y
	var where;
	for(var i = inventory.length - 1; i >= 0; i--){//procura o item a se atualizar no inventario
		if((what ==inventory[i].getId())){
			position=i;
			break;
		}
	}
	if(position!=-1){//se achou no inventario entao de boa
		if(inventory[position].active =="false"){
			active='N';
		}else if(inventory[position].active =="alwaysTrue"){
			active='YY';
		}else{
			active='Y';
		}
		if(action=='pick'){
			where = -1;
		}else{
			where = inventory[position].where;
		}
		$.ajax({
		  url: rest+user_itens,
		  type: 'PUT',
		  data: "fok_user="+ppmk+"&fok_item="+inventory[position].key+"&useritem_active="+active+"&useritem_current_room="+where,
		  success: function(data) {
		  	  //console.log("\nsalvei o "+inventory[position].id + " no inventario!");
		  }
		});
		return;
	}else{// se nao achou no iventario deve estar no chao...
		for(i = items.length - 1; i >= 0; i--){//procura no chao...
			if((what ==items[i].getId())){
				position=i;
				break;
			}
		}
		if(position==-1)return;// se nao achou em nenhum lugar então não é um item valido.
	    if(items[position].active =="false"){
			active='N';
		}else if(items[position].active =="alwaysTrue"){
			active='YY';
		}else{
			active='Y';
		}
		if(action=='pick'){
			where = -1;
		}else{
			where = items[position].where;
		}
	    $.ajax({
		  url: rest+user_itens,
		  type: 'PUT',
		  data: "fok_user="+ppmk+"&fok_item="+items[position].key+"&useritem_active="+active+"&useritem_current_room="+where+'&useritem_state='+items[position].state,
		  success: function(data) {
		  	  //console.log("salvei o "+items[position].id + " no chao!");
		  }
		});
	}
}

function loadItens(){
	var where='';
	var state='';
	var active='';
	$.get(rest+user_itens+'0/'+ppmk, function(data,status){
		dbitensStatus = status;
        if(dbitensStatus == 'success'){
			for(var i=0;i<data.length;i++){//por todos os dados percorre procurando o iten equivalente a esse dado
				for(var j = items.length - 1; j >= 0; j--){//presume que todos os itens estão no chão no começo.
					if((data[i].fok_item ==items[j].getKey())){
						state = parseInt(data[i].useritem_state);
						where= parseInt(data[i].useritem_current_room);
						if(data[i].useritem_active =="Y"){
							active='true';
						}else if(data[i].useritem_active =="YY"){
							active='alwaysTrue';
						}else{
							active='false';
						}
						items[j].setActive(active);
						items[j].setWhere(where);
						items[j].setState(state);
						if(where == -1){//se estiver no inventario entao move ele pro array de inventario
							//console.log('carregado do bd e adicionado ao inventario: '+items[j].getId());
							inventory[inventory.length] = items[j];
							items.splice(j, 1);
							inventory[inventory.length-1].setActive('false');
						}
						break;
					}
				}
			}
			areYouReady();
		}else{
			console.log('ue,não conseguiu conectar ao servidor!');
			console.log('Motivo: '+dbitensStatus);
		}
    });
}
function saveMonster(who){
	var position=-1;
	var active=0;//guarda a traducao false=N true=Y
	var where;
	for(var i = monsters.length - 1; i >= 0; i--){//procura o monstro
		if((who ==monsters[i].getId())){
			position=i;
			break;
		}
	}
	if(position==-1)return;// se nao achou em nenhum lugar então não é um monstro valido.
    if(monsters[position].active =="false"){
		active='N';
	}else if(monsters[position].active =="alwaysTrue"){
		active='YY';
	}else{
		active='Y';
	}
	where = monsters[position].where;
    $.ajax({
	  url: rest+user_monsters,
	  type: 'PUT',
	  data: "fok_user="+ppmk+"&fok_monster="+monsters[position].key+"&usermonster_active="+active+"&usermonster_current_room="+where+'&usermonster_state='+monsters[position].state,
	  success: function(data) {
	  	  //console.log("salvei o "+monsters[position].id);
	  }
	});
}
function loadMonsters(){
	var where='';
	var state='';
	var active='';
	$.get(rest+user_monsters+'0/'+ppmk, function(data,status){
		dbmonstersStatus = status;
        if(dbmonstersStatus == 'success'){
			for(var i=0;i<data.length;i++){//por todos os dados percorre procurando o iten equivalente a esse dado
				for(var j = monsters.length - 1; j >= 0; j--){//presume que todos os itens estão no chão no começo.
					if((data[i].fok_monster ==monsters[j].getKey())){
						state = parseInt(data[i].usermonster_state);
						where= parseInt(data[i].usermonster_current_room);
						if(data[i].usermonster_active =="Y"){
							active='true';
						}else if(data[i].usermonster_active =="YY"){
							active='alwaysTrue';
						}else{
							active='false';
						}
						monsters[j].setActive(active);
						monsters[j].setWhere(where);
						monsters[j].setState(state);
						break;
					}
				}
			}
			areYouReady();
		}else{
			console.log('ue,não conseguiu conectar ao servidor!');
			console.log('Motivo: '+dbmonstersStatus);
		}
    });
}
function saveRoom(what){
	//recebe o numero da Sala Atual (salaAtual+1)
    $.ajax({
	  url: rest+user_rooms,
	  type: 'PUT',
	  data: "fok_user="+ppmk+"&fok_room="+what+'&userroom_state='+roomsStates[(parseInt(what)-1)]+'&userroom_visited=1',
	  success: function(data) {
	  	  //console.log("salvei o room "+what);
	  }
	});
}
function loadRooms(){
	var state='';
	var aux='';
	$.get(rest+user_rooms+'0/'+ppmk, function(data,status){
		dbroomsStatus = status;
        if(dbroomsStatus == 'success'){
			for(var i=0;i<data.length;i++){//por todos os dados percorre procurando o room equivalente a esse dado
				for (var j = roomsStates.length - 1; j >= 0; j--) {
					if(j==(parseInt(data[i].fok_room)-1)){
						roomsStates[j]=parseInt(data[i].userroom_state);
					}
				}
			}
		areYouReady();
		}else{
			console.log('ue,não conseguiu conectar ao servidor!');
			console.log('Motivo: '+dbroomsStatus);
		}
    });
}
function doLogGame(type){
	var history = document.getElementById("scrollDiv").innerHTML;
	//pega a ultima linha 
	history=getLastMove(history);
	//consumir as tags e retornar texto
	history=consumeTags(history);
	// Send the data using post
	$.post( 
	    rest+user_logs, {fok_user:ppmk,log_table:type,log_description:history} 
	).done(function( data ) {
	    var content = "";
	    
	    if (data=="1") { //console.log('sucesso ao salvar o log :)');
	    } else { console.log('falha ao salvar o log :(');
	    }   
	});
}
function getLastMove(text){
	var aux;
	aux = text.slice(lastMove,text.length);
	lastMove = lastMove+aux.length;
	aux=aux.split("!");
	return aux[aux.length-1].trim();
}
function initLog(){
	var history = document.getElementById("scrollDiv").innerHTML;
	lastMove= history.length;
}
function consumeTags(text){
	var inTag=0;
	var newText="";
	for(var i = 0;i<=text.length-1;i++){
		if(text[i]=='<'){
			inTag++;
		}
		else if(text[i]=='>'){
			inTag--;
		}
		else if(inTag==0){
			if(/[A-Z]/.test( text[i] )){
				newText+='/';
			}
			newText+=text[i];
		}
	}
	return newText;
}

function item(id,where,active,state,key){//isso eh meio que uma classe...
	this.id = id;
	this.where = where;
	this.active = active;
	this.state = state;
	this.key = key;

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

	this.getKey= function(){
		return this.key;
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
	
	this.setKey= function(key){
		this.key=key;
	}
}

function monster(id,where,active,state,key){//isso eh meio que uma classe...
	this.id = id;
	this.where = where;
	this.active = active;
	this.state = state;
	this.key = key;

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

	this.getKey= function(){
		return this.key;
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
	
	this.setKey= function(key){
		this.key=key;
	}
}

function carregaTudo(game){
	curGame=game;
	$('#overlay').fadeOut(500,function(){		
		$(".overlay").remove();
    });
	//carrega do save do jogo!
	loadUser();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			loadGame(xhttp);
			finalRoom = parseInt(xhttp.responseXML.getElementsByTagName("finalRoom")[0].childNodes[0].nodeValue);	
			carregado=true;
			areYouReady();
		}else{
			//feedBackHistory("Carregando...");  
		}
	};
	xhttp.open("GET", "xmls/"+curGame, true);//aqui determina o carregamento assincrono
	xhttp.send();
}

function areYouReady(){
	if(carregado && dbplayerStatus=='success' && dbitensStatus=='success' && dbmonstersStatus=='success' && dbroomsStatus=='success'){
		carregaSala(xhttp);
		document.getElementById('loadingCat').style.display='none';
		initLog();//isso é super importante, visto que o log se orienta o começo do log por aqui
	}else{
		document.getElementById('loadingCat').style.display='block';
		document.getElementById("descriptionRoom").innerHTML = 'Carregando...';
		//if(dbstatus!='success')window.location.replace('http://localhost/codedungeon/frontclient');
	}
}

function loadGame(xml){//carrega o jogo a partir do xml (prmeiro jogo)
	var xmlDoc = xml.responseXML;
	var statusXML = xmlDoc.getElementsByTagName("state")[0];
	
	var id ="";
	var where = "";
	var active ="";
	var state ="";
	var key = "";
	//carrega a sala do usuario
	salaAtual = parseInt(statusXML.getElementsByTagName("curRoom")[0].childNodes[0].nodeValue)-1;	
	
	var monsterr = statusXML.getElementsByTagName("monster");
	var itemm = statusXML.getElementsByTagName("item");
	var roomss = statusXML.getElementsByTagName("room");

	//carrega os monstros
	for(var i=0;i<monsterr.length;i++){
		id=	monsterr[i].getAttribute('id');
		where= monsterr[i].getAttribute('where');
		active= monsterr[i].getAttribute('active');
		state = monsterr[i].childNodes[0].nodeValue;
		key = i+1;
		monsters[i] = new monster(id,where,active,state,key);
	}

	//carrega os itens
	for(var i=0;i<itemm.length;i++){
		id=	itemm[i].getAttribute('id');
		where= itemm[i].getAttribute('where');
		active= itemm[i].getAttribute('active');
		state = itemm[i].childNodes[0].nodeValue;
		key = i+1;
		items[i] = new item(id,where,active,state,key);
	}
	// carrega as salas
	for(var i=0;i<roomss.length;i++){
		roomsStates[parseInt(roomss[i].getAttribute('id')-1)] =  roomss[i].childNodes[0].nodeValue;
	}
}

function carregaSala(xhttp){
	nSala(xhttp);
	descriptionRoom(xhttp);	
	fimDeJogo();//testa se ta na ultima sala
}

function nSala(){//bota no numero da sala no canto da div :)
	
	document.getElementById("roomNumber").innerHTML ="Sala: "+ parseInt(salaAtual+1);
}
function criaJanela(tipo,texto){
	//criando a div 
	var divPopup = document.createElement("DIV");
    divPopup.id = "overlay1";
    divPopup.className = "overlayTutorial";
    var divCaixaResposta = document.createElement("DIV");
    divCaixaResposta.id = "divTutorial";
    divPopup.appendChild(divCaixaResposta);
    document.getElementById("divPrincipal").appendChild(divPopup);
	if(texto!=undefined)document.getElementById('divTutorial').innerHTML=texto;
	if(tipo == "alerta"){
		divPopup.className = "overlayAlerta";
		document.getElementById('divTutorial').innerHTML+="<br><br>";
	}else if(tipo == "tutorial"){
		divPopup.className = "overlayTutorial";
		document.getElementById('divTutorial').innerHTML+="<br>";
	}
}
function fadeJanela(q){
    if(q=="hook"){
    	document.getElementById("overlay1").innerHTML += "<br><input type=\"submit\" id=\"btnOk\" value=\"Ok\" onclick=\"blockTutorial();\">";
    }else if(q=="fadebackground"){
  		document.getElementById("overlay1").innerHTML += "<br><input type=\"submit\" id=\"btnOk\" value=\"Ok\" onclick=\"endJanelaOverlay();\">";
    }else if(q=="disconnect"){
  		document.getElementById("overlay1").innerHTML += "<br><input type=\"submit\" id=\"btnOk\" value=\"Ok\" onclick=\"endJanelaDisconnect();\">";
   	}else{
    	document.getElementById("overlay1").innerHTML += "<br><input type=\"submit\" id=\"btnOk\" value=\"Ok\" onclick=\"endJanela();\">";
    }
    $(document).ready(function(){
        $('#overlay1, #overlay-back').fadeIn(500);                
    });
}
function tutorial(){
    document.getElementById('divTutorial').innerHTML='Ola! Bem vindo! Para comecar a jogar primeiro voce tem que aprender os comandos:<dl>';
	document.getElementById('divTutorial').innerHTML+="<dt>- Inventory ou I";
	document.getElementById('divTutorial').innerHTML+="<dd>Mostra o inventario atual do jogador(vc).</dd>";
	document.getElementById('divTutorial').innerHTML+="<dt>- Go (where)</dt>";
	document.getElementById('divTutorial').innerHTML+="<dd>Move o jogador para outra sala, dependendo da direção informada.</dd>";
	document.getElementById('divTutorial').innerHTML+="<dt>- (where)</dt>";
	document.getElementById('divTutorial').innerHTML+="<dd>É pra onde ir,north/n,south/s,west/w e east/e.</dd>";
	document.getElementById('divTutorial').innerHTML+="<dt>- Look (where) ou (what)</dt>";
	document.getElementById('divTutorial').innerHTML+="<dd>Serve pra tentar prever o que vai ter na sala,cuidado ao entrar em salas que vc nao olhou primeiro!</dd>";
	document.getElementById('divTutorial').innerHTML+="<dt>- (what)</dt>";
	document.getElementById('divTutorial').innerHTML+="<dd>Pode ser item ou um monstro.</dd>";
	document.getElementById('divTutorial').innerHTML+="<dt>- Pick/take (what)</dt>";
	document.getElementById('divTutorial').innerHTML+="<dd> Com esse comando vc pega um item selecionado!</dd>";
	document.getElementById('divTutorial').innerHTML+="<dt>- Drop (what)</dt>";
	document.getElementById('divTutorial').innerHTML+="<dd>Solta o item do inventario no chao.</dd>";
	document.getElementById('divTutorial').innerHTML+="<dt>- Use (what) on (what)</dt>";
	document.getElementById('divTutorial').innerHTML+="<dd> Usa um item em algum outro item,dentro do inventario ou nao, desde que o jogador esteja na sala daquele item.</dd>";
	document.getElementById('divTutorial').innerHTML+="</dl>Boa sorte!";
}
function tutorialAux(){
	feedBackHistory("Lembre-se:");
	feedBackHistory("inventory/i,go <where>,look <where/something>,pick/take <something>,drop <something>,use <something> on <something>.");
	feedBackHistory("<where> é qualquer lugar, especificamente north/n,south/s,west/w e east/e.");
	feedBackHistory("<what> é qualquer item, ou inimigo.");
	feedBackHistory("Esses são os comandos do jogo!");
	feedBackHistory("Para ver o tutorial completo use o comando: tutorial");
	feedBackHistory("");
}
function endJanela(){
	$('#overlay1').fadeOut(500,function(){		
		$(".divTutorial").remove();
		$(".overlayTutorial").remove();
		$(".overlayAlerta").remove();
		updateScroll();
    });
}
function endJanelaOverlay(){
	$('#overlay1,#overlay-back').fadeOut(500,function(){		
		$(".divTutorial").remove();
		$(".overlayTutorial").remove();
		$(".overlayAlerta").remove();
		document.getElementById('CommandInput').focus();
		updateScroll();
    });
}
function endJanelaDisconnect(){
	$('#overlay1').fadeOut(500,function(){		
		$(".divTutorial").remove();
		$(".overlayTutorial").remove();
		$(".overlayAlerta").remove();
		disconnect();
		carregaSala(xhttp);
    });
}
function endJanelaHook(){
	$('#overlay1').fadeOut(500,function(){		
		$(".divTutorial").remove();
		$(".overlayTutorial").remove();
		$(".overlayAlerta").remove();
    });
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
					if(monsters[i].getState() == 1){//monstro ainda nao enfrentado
						descriptionDroped = descriptions[0].childNodes[0].nodeValue;
						connect(xhttp,monsters[i].getId());
						break;
					}else if(monsters[i].getState() == 2){// monstro ja derrotado
						descriptionDroped = descriptions[1].childNodes[0].nodeValue;
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
	if(res[1]!=null)res[1]=res[1].trim();
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
		saveRoom(parseInt(salaAtual)+1);
		go(res[1],xhttp);
		saveUser();
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
	case "tutorial":    	
		showTutorial();
		break;
	case "i":    	
		seeInventory();
		break;
	case "menu":    	
		loadMenu(http);
		feedBackHistory("Menu!");
		break;
	case "ni":    	
		seeNotInventory();
		break;
	case "drop":
		drop(res[1]); 	
		break;
	case "use":    	
		use(res[1],res[3],xhttp);//eu uso os indices 1 e 3 pq a sintaxe do cmoando é (use<what> on <what>)   	
		saveRoom(parseInt(salaAtual)+1);
		break;
	default:
		feedBackHistory("Isso nao faz sentido!");
	break;
	}
	//log data
	return false;

}
function pick(what){
	for(var i = items.length - 1; i >= 0; i--){
		if(what == items[i].getId()){
			if(items[i].getActive() == "true"){
				//console.log("O item que vc quer pegar ta aqui: "+items[i].getWhere()+" e vc tá aqui: "+ (salaAtual+1));
				if(items[i].getWhere() == (salaAtual+1)){
					inventory[inventory.length] = items[i];
					items.splice(i, 1);
					feedBackHistory("Pegou "+ what + "!");
					inventory[inventory.length-1].setActive("false");
					descriptionRoom(xhttp);
					doLogGame('itens');
					saveIten(what,'pick');
					return;
				}else{
					feedBackHistory("Nao consigo pegar isso, não está nessa sala!");//tem no jogo mas n tem no inventario
				return;	
				}
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
		if((what ==inventory[i].getId()) && inventory[i].getActive() == "false"){
			items[items.length] = inventory[i];
			inventory.splice(i, 1);
			feedBackHistory("Soltou "+ what + " na Sala "+ (salaAtual+1) +"!" );
			items[items.length-1].setActive("true");
			items[items.length-1].setWhere(salaAtual+1);
			descriptionRoom(xhttp);
			saveIten(what);
			doLogGame('itens');
			return;	
		}
	}
	feedBackHistory("Nao tenho nenhum item assim");//n tem no jogo
}

/*
	//forzinho padrao pra consulta de items no inventario
	for(var i = inventory.length - 1; i >= 0; i--){
		if((what ==inventory[i].getId()) && inventory[i].getActive() == "false" ){
			
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
		doLogGame('itens');
	}
}
function seeNotInventory(){
	var aux='';
	feedBackHistory("Chao: ");
	for (var i = items.length - 1; i >= 0; i--) {
		aux+=items[i].getId()+';'
	}
	feedBackHistory(aux);
	doLogGame('itens');
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
			if(has[k].trim() == inventory[l].getId()){
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
		if(inventory[i].getId().trim() == what.trim()){
			items[items.length] = inventory[i];
			inventory.splice(i, 1);
			items[items.length-1].setWhere(salaAtual+1);
			feedBackHistory("Perdeu "+ what + "!");
			doLogGame('itens');
			return;
		}
	}
}
function give(what){
	for(var i = items.length - 1; i >= 0; i--){
		if(what.trim() == items[i].getId()){
			inventory[inventory.length] = items[i];
			items.splice(i, 1);
			feedBackHistory("Pegou "+ what + "!");
			doLogGame('itens');
			inventory[inventory.length-1].setActive("false");
			descriptionRoom(xhttp);
			return;
		}
	}
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

function toolboxManager(){
	var xmlDoc = xhttp.responseXML;
	var inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];
	var itemm = inventoryXML.getElementsByTagName("item");
	var blocksXML='';//guarda uma string grandona com a tag use de cada bloco
	var logica='';
	var loops='';
	var matematica ='';
	var texto='';
	var jaTem=0;//variavel auxiliar pra testar se aquele bloco ja tem nos blocos que o carinha ja teve
	if(blocks.length == 0){
		criaJanela("alerta","Você não tem os blocos necessários para lutar!");
		fadeJanela("fadebackground");
		return false;
	}else{
		//adiciona ou retira os blocos da nova toolbox
		for (var i = blocks.length - 1; i >= 0; i--) {
			for (var j = itemm.length - 1; j >= 0; j--) {
				if(itemm[j].getAttribute('id') == inventory[blocks[i]].getId()){
					//tem que testar se ele nao inicia uma categoria nova
					for (var k = catLogic.length - 1; k >= 0; k--) {
						if(catLogic[k] == itemm[j].getAttribute('id')){
							logica+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 
							//isso tudo pra ver se ele ja teve esse bloco e nao chamar o tutorial duas vezes
							jaTem=0;
							for (var l = blocksHad.length - 1; l >= 0; l--) {
								if(blocksHad[l]==itemm[j].getAttribute('id')){
									jaTem=1;
								}
							}
							if(jaTem==0){
								blocksHad[blocksHad.length]=itemm[j].getAttribute('id');
								blocksTutorial[blocksTutorial.length]=itemm[j].getAttribute('id');
							}
						}
					}
					for (var k = catLoops.length - 1; k >= 0; k--) {
						if(catLoops[k] == itemm[j].getAttribute('id')){
							loops+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 	
							//isso tudo pra ver se ele ja teve esse bloco e nao chamar o tutorial duas vezes
							jaTem=0;
							for (var l = blocksHad.length - 1; l >= 0; l--) {
								if(blocksHad[l]==itemm[j].getAttribute('id')){
									jaTem=1;
								}
							}
							if(jaTem==0){
								blocksHad[blocksHad.length]=itemm[j].getAttribute('id');
								blocksTutorial[blocksTutorial.length]=itemm[j].getAttribute('id');
							}
						}
					}
					for (var k = catMath.length - 1; k >= 0; k--) {
						if(catMath[k] == itemm[j].getAttribute('id')){
							matematica+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 
							//isso tudo pra ver se ele ja teve esse bloco e nao chamar o tutorial duas vezes
							jaTem=0;
							for (var l = blocksHad.length - 1; l >= 0; l--) {
								if(blocksHad[l]==itemm[j].getAttribute('id')){
									jaTem=1;
								}
							}
							if(jaTem==0){
								blocksHad[blocksHad.length]=itemm[j].getAttribute('id');
								blocksTutorial[blocksTutorial.length]=itemm[j].getAttribute('id');
							}	
						}
					}
					for (var k = catText.length - 1; k >= 0; k--) {
						if(catText[k] == itemm[j].getAttribute('id')){
							texto+=itemm[j].getElementsByTagName("use")[0].childNodes[0].nodeValue; 
							//isso tudo pra ver se ele ja teve esse bloco e nao chamar o tutorial duas vezes
							jaTem=0;
							for (var l = blocksHad.length - 1; l >= 0; l--) {
								if(blocksHad[l]==itemm[j].getAttribute('id')){
									jaTem=1;
								}
							}
							if(jaTem==0){
								blocksHad[blocksHad.length]=itemm[j].getAttribute('id');
								blocksTutorial[blocksTutorial.length]=itemm[j].getAttribute('id');
							}
						}
					}
				}
			}
		}
		if(logica!=''){
			logica='<category id="catLogic" colour="210" name="Logica">'+logica+'</category>';
		}
		if(loops!=''){
			loops='<category id="catLoops" colour="120" name="Loops">'+loops+'</category>';
		}
		if(matematica!=''){
			matematica='<category id="catMath" colour="230" name="Matematica">'+matematica+'</category>';
		}
		if(texto!=''){
			texto='<category id="catText" colour="160" name="Entrada/Saida">'+texto+'</category>';
		}
		blocksXML +=texto+logica+loops+matematica;
		blocksXML=replaceBrakets(blocksXML);
		if(loops!=''){
			blocksXML+='<sep></sep><category id="catVariables" colour="330" custom="VARIABLE" name="Variaveis"></category>'; 
		}
		if(loops!='' && matematica !='' && logica!='' && texto!=''){
			//blocksXML+='<category id="catFunctions" colour="290" custom="PROCEDURE" name="Funções"></category>'; 
		}
		//cria a toolbox se ela ainda nao existir e sobreescreve ela se ja existir
		if(document.getElementById("toolbox") != null){
			document.getElementById('toolbox').innerHTML = blocksXML;
		}else{
			var code = '<xml id="toolbox" class="toolbox" style="display: none">'+blocksXML+'</xml>';
			document.body.innerHTML+= code;
		}
	}
	return true;
}

function blockTutorial(){
	var xmlDoc = xhttp.responseXML;
	var inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];
	var itemm = inventoryXML.getElementsByTagName("item");

	for (var i = blocksTutorial.length - 1; i >= 0; i--) {
		for (var j = itemm.length - 1; j >= 0; j--) {
			if(itemm[j].getAttribute('id') == blocksTutorial[i]){
				//achou o bloco no xml agora é soh printar a janela com o tutorial dele e tirar ele da lista de blocksTutorial
				blocksTutorial.splice(blocksTutorial.length-1);
				if(document.getElementById('divTutorial')==null){
					criaJanela("tutorial",itemm[j].getElementsByTagName("tutorial")[0].childNodes[0].nodeValue);
					fadeJanela("hook");
				}else{
					document.getElementById('divTutorial').innerHTML = itemm[j].getElementsByTagName("tutorial")[0].childNodes[0].nodeValue;
				}
				return;
			}
		}
	}
	endJanelaHook();
}

function disconnect(){
    $('#overlay, #overlay-back,#blocklyTooltipDiv,#blocklyWidgetDiv').fadeOut(500,function(){	
		/*
		workspace.updateToolbox({toolbox: document.getElementById('toolbox'),
		     zoom:
		         {controls: true,
		          wheel: true,
		          startScale: 1.0,
		          maxScale: 3,
		          minScale: 0.3,
		          scaleSpeed: 1.2},
		     trashcan: true});
		*/
		document.getElementById('CommandInput').onkeypress = function(e) {
			var event = e || window.event;
			var charCode = event.which || eventk.eCode;
			if ( charCode == '13') {
				processInput(e);
			}
		}
		document.getElementById('CommandInput').focus();
		updateScroll();
    });
    if(workspace!=null)workspace.clear();
    saveMonster(currentMonster);
    saveRoom(parseInt(salaAtual)+1);
    currentMonster='';
	document.getElementById('CommandInput').focus();
	updateScroll();
}

function connect(xml,who){
	if(!toolboxManager()){//atualiza os blocos que o cara tem
		return;
	}
	currentMonster=who.trim();
	var xmlDoc = xml.responseXML;
    bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
    var monsterr = bestiaryXML.getElementsByTagName("monster");
    connected = false;
    chalenge = "";
    //carregando o desafio do xml
    for (var i = monsters.length - 1; i >= 0; i--) {
  		if(((monsters[i].getActive().trim() == "true") || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1) && (monsters[i].getId().trim() == currentMonster))){			
  			for (var j = monsterr.length - 1; j >= 0; j--){	  		
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
		  	
		   	document.getElementById("codeDiv").innerHTML += "<input type=\"submit\" id=\"btnRun\" value=\"Run Code\" onclick=\"runCode();\">"
		   	document.getElementById("codeDiv").innerHTML += "<input type=\"submit\" id=\"btnRunAway\" value=\"Run Away\" onclick=\"disconnect();\">"

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
			document.getElementById("chalenge").innerHTML += "<ul id=chalengeUl><li id=chalengeText></li></div>";
			document.getElementById("chalengeText").innerHTML += chalenge;
			updateCode();
			blockTutorial();
		}else{
			workspace.updateToolbox(document.getElementById('toolbox'));
			document.getElementById("resultPre").innerHTML = "";
			document.getElementById("chalenge").innerHTML = "Desafio:";
			document.getElementById("chalenge").innerHTML += "<ul id=chalengeUl><li id=chalengeText></li></div>";
			document.getElementById("chalengeText").innerHTML += chalenge;
			updateCode();
			blockTutorial();
			 $(document).ready(function(){
		    	$('#overlay, #overlay-back').fadeIn(500);                
			});
		}
	}
}
function updateCode(event) {
	var languageDropdown = document.getElementById('languageDropdown');
    var languageSelection = languageDropdown.options[languageDropdown.selectedIndex].value;
	var code = Blockly[languageSelection].workspaceToCode(workspace);
	if(languageSelection == 'JavaScript'){
		code = replaceCommand(code,'highlight');
	}
	code = "<br>Código:<br><pre id=\"codePre\">"+code+"</pre>";
  	document.getElementById('code').innerHTML = code;
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

function runCode() {
	document.getElementById('btnRunAway').disabled = 'disabled';
	document.getElementById('btnRun').disabled = 'disabled';
    var code2 = Blockly.JavaScript.workspaceToCode(workspace);
    var code=comentaRapidao(code2,'imprimir');
    code = comentaRapidao(code,'highlight');
    code= replaceCommand(code,'ler');
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
       	criaJanela("alerta","Loop Infinito!");
		fadeJanela();
       //return;
    }else{
    	//colocando o codigo no html
    	document.getElementById('resultPre').innerHTML='';
    	var para = document.createElement('script');
    	para.id="CodeResposta";
    	para.className="CodeResposta";
    	$(".CodeResposta").remove();//removo o script anterior
    	code2 = replaceCommand(code2,'imprimir');
		code2 = comentaRapidao(code2,'alert');
		code2 = comentaRapidao(code2,'highlight');
		code2 = replaceCommand(code2,'ler');
		var t = document.createTextNode(code2);      // Create a text node
		para.appendChild(t);   
		document.head.appendChild(para);
		
		testaResultado();
    }
	document.getElementById('btnRun').disabled = '';
	document.getElementById('btnRunAway').disabled = '';
}
function testaResultado(){
	var xmlDoc = xhttp.responseXML;
    var bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
    var monsterr = bestiaryXML.getElementsByTagName("monster");
    var chalenge = "";
    //carregando o desafio do xml
    for (var i = monsters.length - 1; i >= 0; i--) {
  		if(((monsters[i].getActive().trim() =="true") || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1) && monsters[i].getId().trim() == currentMonster.trim())){			
  			for (var j = monsterr.length - 1; j >= 0; j--){	  				
  				if(monsterr[j].getAttribute("id") == monsters[i].getId()){
  					chalenge =monsterr[j].getElementsByTagName("test")[0].childNodes[0].nodeValue;//carrega o TESTE E NAO O PROBLEMA
						if(document.getElementById('resultPre').innerHTML == chalenge){
						criaJanela("alerta","Resposta Certa!");
						fadeJanela("disconnect");
						//setar o monstro atual como derrotado
						monsters[i].setState(2);
						//setar o novo estado da sala
						roomsStates[parseInt(salaAtual)] = 2;
					}else{
						criaJanela("alerta","Resposta Errada!");
						fadeJanela("overlay");
					}
					return;
  				}
  			}
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
function placeArrayRead(code){
	var xmlDoc = xhttp.responseXML;
    var bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
    var monsterr = bestiaryXML.getElementsByTagName("monster");
    var read = "";
    var arrayRead=[];
    var i=0,j=0;
    //carregando o desafio do xml
    for (var i = monsters.length - 1; i >= 0; i--) {
  		if(((monsters[i].getActive().trim() == "true") || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1) && monsters[i].getId().trim() == currentMonster.trim())){			
  			for (var j = monsterr.length - 1; j >= 0; j--){	  				
  				if(monsterr[j].getAttribute("id") == monsters[i].getId()){
  					read =monsterr[j].getElementsByTagName("read")[0].childNodes[0].nodeValue;//carrega o read
  				}
  			}
  		}
	}
	read=read.split("");
	read[read.length-1]='';
	for (var i = 1; i <= read.length - 1; i++) {
		read[0]+=read[i];
	}
	code = "var read=["+read[0]+"];\n"+code;
	return code;
}
function replaceCommand(code,what,Nreads){
	var i=0;
	var j=0;
	var aux='';
	var aux2=[];
	var newCode=[];
	var Nread;
	if(Nreads != null && Nreads != undefined){
		Nread=Nreads;
	}else{
		Nread=0;
	}
	
	newCode[0] = '';
	var moreReadOnSameLine =false;
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
				var value2='';
				//alert(newCode[i]);
				for(var k=newCode[i].indexOf('(');k<=newCode[i].lastIndexOf(')');k++){
					value += newCode[i][k];
					value2 += newCode[i][k];
					if(value2.length == 2 && newCode[i].indexOf("'")!=-1){
						value2+=',';
					}
				}
				if(newCode[i].indexOf("'")!=-1){
					newCode[i] = '\nif(document.getElementById("resultPre").innerHTML==""){document.getElementById("resultPre").innerHTML+='+value+';}else{document.getElementById("resultPre").innerHTML+='+value2+';}';
				}else if(newCode[i].indexOf("'")==-1){
					newCode[i] = '\ndocument.getElementById("resultPre").innerHTML+='+value+';';
				}
				
				//alert(newCode[i]);
			}

		}
		else if(what == 'highlight'){
			if(newCode[i].includes('highlightBlock(')){
				newCode[i] ='';
			}
		}
		else if(what == 'ler'){
			if(newCode[i].includes('ler()')){
				//alert(newCode[i]);
				aux2[0]=newCode[i].slice(0,newCode[i].indexOf('ler()'));
				aux2[1]=newCode[i].slice(newCode[i].indexOf('ler()')+5,newCode[i].length);
				//alert(aux2[0]);
				//alert(aux2[1]);
				aux2[1]='read[auxRead'+Nread+'++]'+aux2[1];
				newCode[i]=aux2[0]+aux2[1];
				//alert(newCode[i]);
				Nread++;
				if(newCode[i].includes('ler()'))moreReadOnSameLine=true;
			}
		}			
	}
	for (i = 0; i < newCode.length; i++) {
		aux+=newCode[i];
	}
	if(Nread>0 && !moreReadOnSameLine){
		//alert(aux);
		for (i = 0; i < Nread; i++) {
			aux="var auxRead"+i+"=0;\n"+aux;
		}
		aux=placeArrayRead(aux);
		//alert(aux);
	}
	if(moreReadOnSameLine){
		aux=replaceCommand(aux,what,Nread);
	}
	return aux;
}

function comentaRapidao(code,what){
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
		}else if(what == 'ler'){
			if(newCode[i].includes('ler(')){
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
		if(what ==inventory[i].getId() && inventory[i].getActive() == "false" ){//achando o assassino que eu vou usar o use
			for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
				if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id').trim() == inventory[i].getId()){//se i tem que eu uero usar eh o item no xml
					if(inventoryXML.getElementsByTagName("use")[j].childNodes.length > 0){//se a tag use ta vazia
						if(inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("in")[0].getAttribute('what').trim() == onWhat){//achando a tag da vitima
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
								feedBackHistory("Acredito que eu tenha que usar esses items em outro lugar!");
								return;
							}
							
							//AS ACOES SE O USE FOR APROVADO
							//carrega e faz o print
							for (var k = actions.getElementsByTagName("print").length - 1; k >= 0; k--) {
								feedBackHistory(actions.getElementsByTagName("print")[k].childNodes[0].nodeValue);
								doLogGame('itens');
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
									if((inventory[l].getActive().trim() == "false") && (inventory[l].getId().trim() == doSomething.victim)){
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
										if(((items[l].getActive().trim() == "true") || (items[l].getActive() == ("alwaysTrue"))) && (items[l].getId() == (doSomething.victim))){
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
							//alert("fim do DO"); feito com sucesso
							carregaSala(xhttp);
							saveIten(what);
							saveIten(onWhat);
							return;
						}
					}
				}
			}
			feedBackHistory("Nao consigo usar esse item nisso!");
			return;// o use so vai servir pra um unico item por vez,sendo que um item pode ter varios use(na vdd so um ,mas ele tem varios <in>), mas so vai executar um de cada vez
		}
	}
	feedBackHistory("Nao tenho nenhum item assim!");//n tem no inventario ou n jogo
}

function go(where,xml){//tem q por as siglas w,e,s,n
	var xmlDoc = xml.responseXML;
	var numberNext;
	var roomm = xmlDoc.getElementsByTagName("rooms")[0];
	var room = roomm.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom");
	//alert(nextRoom.length);
	for (var i = 0; i <= nextRoom.length - 1; i++) {
		if (parseInt(nextRoom[i].getAttribute("id")) == roomsStates[salaAtual]) {
			nextRoom = nextRoom[i];
		}
	}
	switch(where){
		case "north":
			if(nextRoom.getElementsByTagName("north")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("north")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);
				doLogGame('rooms');				
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("não consigo ir pra frente!");
			}
			break;
		case "south":
			if(nextRoom.getElementsByTagName("south")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("south")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);
				doLogGame('rooms');
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("não consigo ir pra tras!");
			}
			break;
		case "west":
			if(nextRoom.getElementsByTagName("west")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("west")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);
				doLogGame('rooms');
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("não consigo ir pra direita!");
			}
			break;

		case "east":
			if(nextRoom.getElementsByTagName("east")[0].childNodes.length > 0){
				numberNext = nextRoom.getElementsByTagName("east")[0].childNodes[0].nodeValue;
				feedBackHistory("Entrando na sala "+numberNext);
				doLogGame('rooms');
				salaAtual = parseInt(numberNext)-1;
				carregaSala(xhttp);
			}else{
				feedBackHistory("não consigo ir pra esquerda!");
			}
			break;
		default:
			feedBackHistory("nao tem nada que valha a pena ir nessa direção!");
	}
}

function look(where,xml){//o where tbm pode ser o nome do item, ver o dafault pro tratamento dos itens recebido
	var xmlDoc = xml.responseXML;

	var roomm = xmlDoc.getElementsByTagName("rooms")[0];
	var room = roomm.getElementsByTagName("room")[salaAtual];
	var nextRoom = room.getElementsByTagName("NextRoom");
	var itemDescription;
	var inventoryXML;
	inventoryXML = xmlDoc.getElementsByTagName("inventory")[0];
	var bestiaryXML;
	bestiaryXML = xmlDoc.getElementsByTagName("bestiary")[0];
	for (var i = 0; i <= nextRoom.length - 1; i++) {
		if (nextRoom[i].getAttribute("id") == roomsStates[salaAtual]) {
			nextRoom = nextRoom[i];
		}
	}
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
						feedBackHistory('Ha uma outra porta com "Sala ' + numberNext + '" escrito sobre ela.' + shortDescription[i].childNodes[0].nodeValue);
						doLogGame('rooms');
					}
				}
			}else{
				feedBackHistory("nao tem nada para o norte!");
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
						feedBackHistory('Ha uma outra porta com "Sala ' + numberNext + '" escrito sobre ela.' + shortDescription[i].childNodes[0].nodeValue);
						doLogGame('rooms');
					}
				}
			}else{
				feedBackHistory("nao tem nada para o sul!");
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
						feedBackHistory('Ha uma outra porta com "Sala ' + numberNext + '" escrito sobre ela.' + shortDescription[i].childNodes[0].nodeValue);
						doLogGame('rooms');
					}
				}
			}else{
				feedBackHistory("nao tem nada para o oeste!");
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
						doLogGame('rooms');
					}
				}
			}else{
				feedBackHistory("nao tem nada pra leste!");
			}
			break;
		default://tratamento de items,tem que ter tratamento pra quem ta fora do inventario tbm e tbm dos monstros!
			var itemStatus;
			var descriptions;

			//itens no inventario
			for (var i = inventory.length - 1; i >= 0; i--) {
				if(inventory[i].getActive().trim() == "false" && inventory[i].getId().trim() == where){
					itemStatus = inventory[i].getState();
					for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
						if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id') == inventory[i].getId()){
							descriptions = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("description");
							for (var k = descriptions.length - 1; k >= 0; k--) {
								if(descriptions[k].getAttribute('id') == itemStatus){
									feedBackHistory(descriptions[k].childNodes[0].nodeValue); 
									doLogGame('itens');
									return;
								}
							}		
						}
					}
				}
			}
			//items no chao
			for (i = items.length - 1; i >= 0; i--) {
				if(((items[i].getActive().trim() == "true") || (items[i].getActive() == ("alwaysTrue"))) && (items[i].getWhere() == (salaAtual+1)) && items[i].getId().trim() == where){
					itemStatus = items[i].getState();
					for(var j=0;j < inventoryXML.getElementsByTagName("item").length ;j++){
						if(inventoryXML.getElementsByTagName("item")[j].getAttribute('id') == items[i].getId()){
							descriptions = inventoryXML.getElementsByTagName("item")[j].getElementsByTagName("description");
							for (var k = descriptions.length - 1; k >= 0; k--) {
								if(descriptions[k].getAttribute('id') == itemStatus){
									feedBackHistory(descriptions[k].childNodes[0].nodeValue); 
									doLogGame('itens');
									return;
								}
							}	
						}
					}
				}
			}
			//monstros
			for (i = monsters.length - 1; i >= 0; i--) {
				if(((monsters[i].getActive().trim() == "true") || (monsters[i].getActive() == ("alwaysTrue"))) && (monsters[i].getWhere() == (salaAtual+1) && monsters[i].getId().trim() == where)){
					itemStatus = monsters[i].getState();
					for(var j=0;j < bestiaryXML.getElementsByTagName("monster").length ;j++){
						if(bestiaryXML.getElementsByTagName("monster")[j].getAttribute('id') == monsters[i].getId()){
							descriptions = bestiaryXML.getElementsByTagName("monster")[j].getElementsByTagName("description");
							for (var k = descriptions.length - 1; k >= 0; k--) {
								if(descriptions[k].getAttribute('id') == itemStatus){
									feedBackHistory(descriptions[k].childNodes[0].nodeValue); 
									doLogGame('monsters');
									return;
								}
							}	
						}
					}
				}
			}
			feedBackHistory("nao consigo observar nada assim!");
			break;
	}
}
function fimDeJogo(){
	if((salaAtual+1) == finalRoom){
		criaJanela("alerta","Fim do jogo!Obrigado por jogar!");
		fadeJanela("fadebackground");
		gamesDone[gamesDone.length]=curGame;
	}
}
 