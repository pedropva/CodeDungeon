<?php
    defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>REST Server Tests</title>
        
        <style>
            ::selection { background-color: #E13300; color: white; }
            ::-moz-selection { background-color: #E13300; color: white; }
            
            body {
            background-color: #FFF;
            margin: 40px;
            font: 16px/20px normal Helvetica, Arial, sans-serif;
            color: #4F5155;
            word-wrap: break-word;
            }
            
            a {
            color: #039;
            background-color: transparent;
            font-weight: normal;
            }
            
            h1 {
            color: #444;
            background-color: transparent;
            border-bottom: 1px solid #D0D0D0;
            font-size: 24px;
            font-weight: normal;
            margin: 0 0 14px 0;
            padding: 14px 15px 10px 15px;
            }
            
            code {
            font-family: Consolas, Monaco, Courier New, Courier, monospace;
            font-size: 16px;
            background-color: #f9f9f9;
            border: 1px solid #D0D0D0;
            color: #002166;
            display: block;
            margin: 14px 0 14px 0;
            padding: 12px 10px 12px 10px;
            }
            
            #body {
            margin: 0 15px 0 15px;
            }
            
            p.footer {
            text-align: right;
            font-size: 16px;
            border-top: 1px solid #D0D0D0;
            line-height: 32px;
            padding: 0 10px 0 10px;
            margin: 20px 0 0 0;
            }
            
            #container {
            margin: 10px;
            border: 1px solid #D0D0D0;
            box-shadow: 0 0 8px #D0D0D0;
            }
        </style>
    </head>
    <body>
        
        <div id="container">
            <h1>REST Server Tests</h1>
            
            <div id="body">
                <p>
                    See the article
                    <a href="http://net.tutsplus.com/tutorials/php/working-with-restful-services-in-codeigniter-2/" target="_blank">
                        http://net.tutsplus.com/tutorials/php/working-with-restful-services-in-codeigniter-2/
                    </a>
                </p>
                <p>Click on the links to check whether the REST server is working.</p>
                
                <ol>
                    <li><a href="<?php echo base_url('api/login'); ?>">Session</a> - JSON</li>
                    <li><a href="<?php echo base_url('api/users'); ?>">List Users</a> - JSON</li>
                    <li><a href="<?php echo base_url('api/monsters'); ?>">List Monsters</a> - JSON</li>
                    <li><a href="<?php echo base_url('api/itens'); ?>">List Itens</a> - JSON</li>
                    <li><a href="<?php echo base_url('api/logs'); ?>">List Logs</a> - JSON</li>
                </ol>
				<hr>
				Parameters Login: (restserver/api/login/)
				<ol>
                    <li>Create Session  | POST: user_name ; user_pass </li>
                    <li>Verify Session  | GET </li>
                    <li>Destroy Session | DELETE </li>
				</ol>
				Parameters Users: (restserver/api/users/)
                <ol>
                    <li>List | GET </li>
                    <li>Load | GET: pmk_user </li>
                    <li>Create | POST: user_name ; user_pass</li>
                    <li>Edit | PUT: pmk_user ; user_name ; user_pass </li>
                    <li>Delete | DELETE: pmk_user </li>
				</ol>
				Parameters Itens: (restserver/api/itens/)
                <ol>
                    <li>List | GET </li>
                    <li>Load | GET: pmk_item </li>
                    <li>Create | POST: fok_room ; item_name ; item_state ; item_current_room ; item_descricao</li>
                    <li>Edit | PUT: pmk_item ; fok_room ; item_name ; item_state ; item_current_room ; item_descricao</li>
                    <li>Delete | DELETE: pmk_item </li>
                </ol>
				Parameters Monsters: (restserver/api/monsters/)
                <ol>
                    <li>List | GET </li>
                    <li>Load | GET: pmk_monster </li>
                    <li>Create | POST: fok_room ; monster_name ; monster_description ; monster_current_room</li>
                    <li>Edit | PUT: pmk_monster ; fok_room ; monster_name ; monster_description ; monster_current_room</li>
                    <li>Delete | DELETE: pmk_monster </li>
                </ol>
				Parameters User Itens: (restserver/api/user_itens/)
                <ol>
                    <li>List | GET </li>
                    <li>Load | GET: pmk_useritem </li>
                    <li>Create (Inserir item no inventário do usuário) | POST: fok_user ; fok_item ; useritem_active ; useritem_status ; useritem_current_room</li>
                    <li>Edit | PUT: pmk_useritem ; fok_user ; fok_item ; useritem_active ; useritem_status; useritem_current_room</li>
                    <li>Delete (Remover item do inventário do usuário) | DELETE: pmk_useritem </li>
                </ol>
				
            </div>
            <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds. <?php echo  (ENVIRONMENT === 'development') ?  'CodeIgniter Version <strong>'.CI_VERSION.'</strong>' : '' ?></p>
        </div>
        
        <!--
			<h3>Criar Item</h3>
			<div id="result"></div>
			<form role="form" id="formCriar" action="../ci-restserver/api/usuario_itens/" method="post" class="registration-form">
				<div class="form-group">
					<label class="sr-only" for="form-first-name">Usuario</label>
					<input type="text" name="fok_usuario" placeholder="UsuÃ¡rio" class="form-first-name form-control" id="form-first-name">
				</div>
				<div class="form-group">
					<label class="sr-only" for="form-first-name">Item</label>
					<input type="text" name="fok_item" placeholder="Item" class="form-first-name form-control" id="form-item">
				</div>
				<div class="form-group">
					<label class="sr-only" for="form-first-name">Caught</label>
					<input type="text" name="useritem_caught" placeholder="Item" class="form-first-name form-control" id="form-useritem_caught">
				</div>
				<div class="form-group">
					<label class="sr-only" for="form-first-name">Drop</label>
					<input type="text" name="useritem_room_drop" placeholder="Item" class="form-first-name form-control" id="form-useritem_room_drop">
				</div>
				<button type="submit" class="btn">Cadastrar</button>
			</form>
			<script src="https://code.jquery.com/jquery-1.12.0.js"></script>
			<script type="text/javascript">
				$( "#formCriar" ).submit(function( event ) {
					event.preventDefault(); // Stop form from submitting normally
					
					// Get some values from elements on the page:
					var $form = $( this ),
					usuario = $form.find( "input[name='fok_usuario']" ).val(),
					item = $form.find( "input[name='fok_item']" ).val(),
					caught = $form.find( "input[name='useritem_caught']" ).val(),
					drop = $form.find( "input[name='useritem_room_drop']" ).val(),
					url = $form.attr( "action" );
					
					$( "#result" ).empty().append( "" );
					
					// Send the data using post
					var posting = $.post( 
					url, { fok_usuario: usuario, fok_item: item, useritem_caught: caught, useritem_room_drop: drop } 
					).done(function( data ) {
						var content = "";
						
						if (data=="1") { content = ''+
							'<div class="alert btn-success alert-dismissible">'+
							'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>'+
							'Cadastro realizado com sucesso</div>';
							} else { content = ''+
							'<div class="alert btn-warning alert-dismissible">'+
							'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>'+
							'Problema ao cadastrar usuário. (Já existe este nome de usuário)</div>';
						}
						$( "#result" ).empty().append( content );
					});
				});
			</script>
			-->
           
	</body>
</html>