<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class User_rooms extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelusers_rooms', 'user_rooms');
        }
        
        // Essa função vai responder pela rota /api/itens sob o método GET
        function index_get()
        {
            $id = (int) $this->uri->segment(3);
            $id_user = (int) $this->uri->segment(4);
            $get = $_GET;
            
            // Se tem ID carrega
            if($id > 0) {
                
                $user = $this->user_rooms->carregar( $id );
                    
                if($user) {
                    $this->response($user, REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else { // Senão, listar
				if ($id_user > 0) {
					$usuarioItemParam = $get;
					$users = $this->user_rooms->listar($usuarioItemParam);
					
					if($users) {
						$this->response($users, REST_Controller::HTTP_OK);
					} else {
						$this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
					}
				} else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            }
        }

        // Criar
        function index_post()
        {
            // recupera os dados informados no formulário
            $usuario_item = $this->post();
			
            // Se tem ID edita, senão, cria
            if ($usuario) {
                $result = $this->user_rooms->criar($usuario_item);
                
                if($result > 0) {
                    $this->response(1, REST_Controller::HTTP_OK);
                } else {
                    $this->response(0, FALSE);
                }
            }
        }
        
        
        // Editar
        function index_put()
        {
            // recupera os dados informados no formulário
            $usuario = $this->put();
			$usuario_id = 0;
			$room_id = 0;
            if (isset($usuario['fok_user'])) {
				$usuario_id = $usuario['fok_user'];
            }
            if (isset($usuario['fok_room'])) {
				$room_id = $usuario['fok_room'];
            }
			
            // Se tem ID edita, senão bad
            if ( ($usuario_id > 0) && ($room_id > 0) ) {
                $result = $this->user_rooms->editar($usuario);
            
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
			// recupera os dados informados no formulário
            $usuario = $this->delete();
            $usuario_id = $usuario['pmk_userroom'];
            
            // Valida o ID
            if ($usuario_id <= 0)
            {
                $this->response(NULL, REST_Controller::HTTP_BAD_REQUEST); // BAD_REQUEST (400)
            }
            // Executa a remoção do registro no banco de dados
            $delete = $this->user_rooms->deletar($usuario_id);

            if($delete === FALSE) {
                $this->response(0, REST_Controller::HTTP_OK);
            } else {
                $this->response(1, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
    }
