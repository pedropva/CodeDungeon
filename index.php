<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<html>
	<head>

		<link rel="stylesheet" href="style.css">
		<title>
			Code Dungeon
		</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="blockly/blockly_compressed.js"></script>
		<script src="blockly/blocks_compressed.js"></script>
		<script src="blockly/msg/js/pt-br.js"></script>
		<!--<script src="blockly/javascript_compressed.js"></script>-->

		<script src="blockly/blocks/logic.js"></script>
		<script src="blockly/blocks/loops.js"></script>
		<script src="blockly/blocks/variables.js"></script>
		<script src="blockly/blocks/procedures.js"></script>
		<script src="blockly/blocks/text.js"></script>
		<script src="blockly/blocks/math.js"></script>
		<!--GERADOES DO JAVASCRIPT-->
		<script src="blockly/generators/javascript.js"></script>
		<script src="blockly/generators/javascript/logic.js"></script>
		<script src="blockly/generators/javascript/loops.js"></script>
		<script src="blockly/generators/javascript/variables.js"></script>
		<script src="blockly/generators/javascript/procedures.js"></script>
		<script src="blockly/generators/javascript/text.js"></script>
		<script src="blockly/generators/javascript/math.js"></script>
		<!--GERADORES PHP-->
		<script src="blockly/generators/php.js"></script>
		<script src="blockly/generators/php/logic.js"></script>
		<script src="blockly/generators/php/loops.js"></script>
		<script src="blockly/generators/php/variables.js"></script>
		<script src="blockly/generators/php/procedures.js"></script>
		<script src="blockly/generators/php/text.js"></script>
		<script src="blockly/generators/php/math.js"></script>
		<!--GERADOR DART -->
		<script src="blockly/generators/dart.js"></script>
		<script src="blockly/generators/dart/logic.js"></script>
		<script src="blockly/generators/dart/loops.js"></script>
		<script src="blockly/generators/dart/variables.js"></script>
		<script src="blockly/generators/dart/procedures.js"></script>
		<script src="blockly/generators/dart/text.js"></script>
		<script src="blockly/generators/dart/math.js"></script>
		
		<!--GERADOR PYTHON-->
		<script src="blockly/generators/python.js"></script>
		<script src="blockly/generators/python/logic.js"></script>
		<script src="blockly/generators/python/loops.js"></script>
		<script src="blockly/generators/python/variables.js"></script>
		<script src="blockly/generators/python/procedures.js"></script>
		<script src="blockly/generators/python/text.js"></script>
		<script src="blockly/generators/python/math.js"></script>

		<!--GERADOR LUA-->
		<script src="blockly/generators/lua.js"></script>
		<script src="blockly/generators/lua/logic.js"></script>
		<script src="blockly/generators/lua/loops.js"></script>
		<script src="blockly/generators/lua/variables.js"></script>
		<script src="blockly/generators/lua/procedures.js"></script>
		<script src="blockly/generators/lua/text.js"></script>
		<script src="blockly/generators/lua/math.js"></script>
		
		<script src="interpreter/acorn_interpreter.js"></script>
		
	</head>
	<body>
			<h1 class="title" id="gameTitle" align="center">
				Code Dungeon!
			</h1>
			<div id="divPrincipal" class="divPrincipal">
				<div class="divSecond">
					<p class="roomNumber" id="roomNumber">
					</p>
					<br><br>
					<p id="descriptionRoom"></p>
					<br><br>
					O que fazer?
					<div class="divScrollMaior">
						<div class="divScroll" id="scrollDiv"></div>
						<input id="CommandInput" class="inputText"/>
					</div>
					<br>
				</div>
			</div>
			<div id="overlay-back"></div>
			
			<script src="room.js"></script>
	</body>
</html>	