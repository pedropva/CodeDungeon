<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class Itens extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelitens', 'itens');
        }
        
        // Essa função vai responder pela rota /api/itens sob o método GET
        function index_get()
        {
            $id = (int) $this->uri->segment(3);
            $get = $_GET;
            
            // Se tem ID carrega
            if($id > 0) {
                
                $user = $this->itens->carregar( $id );
                    
                if($user) {
                    $this->response($user, REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else { // Senão, listar
                $itensParam = $get;
                $itens = $this->itens->listar($itensParam);
                
                if($itens) {
                    $this->response($itens, REST_Controller::HTTP_OK);
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            }
        }

        // Criar 
        function index_post()
        {
            // recupera os dados informados no formulário
            $item = $this->post();
            $pmk_item = 0;
            if (isset($item['pmk_item'])) {
                $pmk_item = $item['pmk_item'];
            }
            
            if ($item) {
               
                // Se vai criar, tem que informar a sala
                $fok_room = $item['fok_room'];
                $item_name = $item['item_name'];
                $item_state = $item['item_state'];
                $item_current_room = $item['item_current_room'];
                $item_descricao = $item['item_descricao'];
                
                if ($fok_room) {
                    
                    $result = $this->itens->criar($item);
                    
                    if($result > 0) {
                        $this->response(1, REST_Controller::HTTP_OK);
                    } else {
                        $this->response(0, FALSE);
                    }
                } else {
                    $this->response(0, FALSE);
                }
            }
        }
        
        // Editar
        function index_put()
        {
            // recupera os dados informados no formulário
            $item = $this->put();
            
            $item_id = 0;
            if (isset($item['pmk_item'])) {
				$item_id = $item['pmk_item'];
            }
			
            // Se tem ID edita, senão bad
            if ($item_id > 0) {
                $result = $this->itens->editar($item);
            
                if($result == FALSE) {
                    $this->response(0, REST_Controller::HTTP_BAD_REQUEST);
                } else {
                    $this->response(1, REST_Controller::HTTP_OK);
                }
            } else {
                $this->response(0, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
		// Deletar
        public function index_delete()
        {
			// recupera os dados informados no formulário
            $item = $this->delete();
            $item_id = $item['pmk_item'];
            
            // Valida o ID
            if ($item_id <= 0)
            {
                $this->response(NULL, REST_Controller::HTTP_BAD_REQUEST); // BAD_REQUEST (400)
            }
            // Executa a remoção do registro no banco de dados
            $delete = $this->itens->deletar($item_id);

            if($delete === FALSE) {
                $this->response(0, REST_Controller::HTTP_OK);
            } else {
                $this->response(1, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
    }
