<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class Users extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelusers', 'user_model');
			// Tabelas base
            $this->load->model('../models/Modelitens', 'itens_model');
            $this->load->model('../models/Modelmonsters', 'monsters_model');
            $this->load->model('../models/Modelrooms', 'rooms_model');
			// Tabelas adicionais do usu�rio
            $this->load->model('../models/Modeluser_itens', 'user_itens_model');
            $this->load->model('../models/Modeluser_monsters', 'user_monsters_model');
            $this->load->model('../models/Modeluser_rooms', 'user_rooms_model');
			
        }
      
        // Essa fun��o vai responder pela rota /api/users sob o m�todo GET
        function index_get()
        {
            $id = (int) $this->uri->segment(3);
       
            // Se tem ID carrega
            if($id > 0) {
                
                $user = $this->user_model->carregar( $id );
                    
                if($user) {
                    $this->response($user, REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else { // Sen�o, listar
                $users = $this->user_model->listar();
                
                if($users) {
                    $this->response($users, REST_Controller::HTTP_OK);
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            }
        }

        // Criar
        function index_post()
        {
            // recupera os dados informados no formul�rio
            $usuario = $this->post();
			
            // Se tem ID edita, sen�o, cria
            if ($usuario) {
                $usuario['user_pass'] = MD5($usuario['user_pass']);
                $result = $this->user_model->criar($usuario);
				
				// Se criou o novo usu�rio
                if($result > 0) {
					
					// ---------------------------------------------------------
					// Para cada iten, cria uma entrada para este usu�rio atual
					$itensArr = $this->itens_model->listar();
					foreach ($itensArr as $iten) {
						$param['fok_user'] = $result;
						$param['fok_item'] = $iten['pmk_item'];
                        $param['useritem_state'] = $iten['item_state'];
                        $param['useritem_active'] = $iten['item_active'];
                        $param['useritem_current_room'] = $iten['item_current_room'];
                        $param['useritem_current_room'] = $iten['item_is_active'];
						$user_itens_model = $this->user_itens_model->criar($param);
					}
					// ---------------------------------------------------------
					// Para cada monster, cria uma entrada para este usu�rio atual
					$monstersArr = $this->monsters_model->listar();
					foreach ($monstersArr as $monster) {
						$paramM['fok_user'] = $result;
						$paramM['fok_monster'] = $monster['pmk_monster'];
                        $paramM['usermonster_state'] = $monster['monster_state'];
                        $paramM['usermonster_active'] = $monster['monster_active'];
                        $paramM['usermonster_current_room'] = $monster['monster_current_room'];
                        $paramM['usermonster_is_active'] = $monster['monster_is_active'];
						$user_monsters_model = $this->user_monsters_model->criar($paramM);
					}
					// ---------------------------------------------------------
					// Para cada room, cria uma entrada para este usu�rio atual
					$roomnsArr = $this->rooms_model->listar();
					foreach ($roomnsArr as $room) {
						$paramR['fok_user'] = $result;
						$paramR['fok_room'] = $room['pmk_room'];
                        $paramR['userroom_state'] = $room['room_state'];
                        $paramR['userroom_is_active'] = $room['room_is_active'];
						$user_rooms_model = $this->user_rooms_model->criar($paramR);
					}
					// ---------------------------------------------------------
				
                
                    $this->response(1, REST_Controller::HTTP_OK);
                } else {
                    $this->response(0, FALSE);
                }
            }
        }
		
        // Editar
        function index_put()
        {
            // recupera os dados informados no formul�rio
            $usuario = $this->put();
            $usuario_id = 0;
            if (isset($usuario['pmk_user'])) {
				$usuario_id = $usuario['pmk_user'];
            }
			
            // Se tem ID edita, sen�o bad
            if ($usuario_id > 0) {
                $result = $this->user_model->editar($usuario);
            
                if($result == FALSE) {
                    $this->response(0, REST_Controller::HTTP_BAD_REQUEST);
                } else {
                    $this->response(1, REST_Controller::HTTP_OK);
                }
            } else {
                $this->response(0, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
        public function index_delete()
        {
			// recupera os dados informados no formul�rio
            $usuario = $this->delete();
            $usuario_id = $usuario['pmk_user'];
            
            // Valida o ID
            if ($usuario_id <= 0)
            {
                $this->response(NULL, REST_Controller::HTTP_BAD_REQUEST); // BAD_REQUEST (400)
            }
            // Executa a remo��o do registro no banco de dados
            $delete = $this->user_model->deletar($usuario_id);

            if($delete === FALSE) {
                $this->response(0, REST_Controller::HTTP_OK);
            } else {
                $this->response(1, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
    }
