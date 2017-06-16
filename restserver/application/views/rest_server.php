<?php
    defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>REST Server Tests</title>
        <link rel="stylesheet" href="<?php echo base_url("assets/css/style.css"); ?>" />
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
                    <li>Create | POST: item_name ; item_state ; item_current_room ; item_descricao</li>
                    <li>Edit | PUT: pmk_item ; item_name ; item_state ; item_current_room ; item_descricao</li>
                    <li>Delete | DELETE: pmk_item </li>
                </ol>
				Parameters Monsters: (restserver/api/monsters/)
                <ol>
                    <li>List | GET </li>
                    <li>Load | GET: pmk_monster </li>
                    <li>Create | POST: monster_name ; monster_description ; monster_current_room</li>
                    <li>Edit | PUT: pmk_monster ; monster_name ; monster_description ; monster_current_room</li>
                    <li>Delete | DELETE: pmk_monster </li>
                </ol>
				Parameters User Itens: (restserver/api/user_itens/)
                <ol>
                    <li>List | GET: fok_user </li>
                    <li>Load | GET: pmk_useritem </li>
                    <li>Create (Inserir item no inventário do usuário) | POST: fok_user ; fok_item ; useritem_active ; useritem_status ; useritem_current_room</li>
                    <li>Edit | PUT: pmk_useritem ; fok_user ; fok_item ; useritem_active ; useritem_status; useritem_current_room</li>
                    <li>Delete (Remover item do inventário do usuário) | DELETE: pmk_useritem </li>
                </ol>
				
            </div>
            <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds. <?php echo  (ENVIRONMENT === 'development') ?  'CodeIgniter Version <strong>'.CI_VERSION.'</strong>' : '' ?></p>
        </div>
        
	</body>
</html>