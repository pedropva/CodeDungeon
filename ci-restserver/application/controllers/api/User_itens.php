<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class User_itens extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelusuario_itens', 'item_model');
        }
        
        // Essa função vai responder pela rota /api/itens sob o método GET
        function index_get()
        {
            $id = (int) $this->uri->segment(3);
            $get = $_GET;
            
            // Se tem ID carrega
            if($id > 0) {
                
                $user = $this->item_model->carregar( $id );
                    
                if($user) {
                    $this->response($user, REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else { // Senão, listar
                $usuarioItemParam = $get;
                $users = $this->item_model->listar($usuarioItemParam);
                
                if($users) {
                    $this->response($users, REST_Controller::HTTP_OK);
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            }
        }

        // Criar ou editar
        function index_post()
        {
            // recupera os dados informados no formulário
            $item = $this->post();
            $pmk_useritem = 0;
            if (isset($item['pmk_useritem'])) {
                $pmk_useritem = $item['pmk_useritem'];
            }
            
            // Se tem ID edita, senão, cria
            if ($pmk_useritem > 0) {
                
                $result = $this->item_model->editar($item);
            
                if($result == FALSE) {
                    $this->response(0, REST_Controller::HTTP_BAD_REQUEST);
                } else {
                    $this->response(1, REST_Controller::HTTP_OK);
                }
            } else {
                // Se vai criar, tenta carregar pra deletar se já existir
                $fok_usuario = $item['fok_user'];
                $fok_item = $item['fok_item'];
                
                if ($fok_usuario > 0 && $fok_item > 0) {
                    
                    $usuarioItem = $this->item_model->carregar_por_usuario_item($fok_usuario, $fok_item);
                
                    if ($usuarioItem) {
                        $this->item_model->deletar($usuarioItem[0]['pmk_useritem']);   
                    }
                    $result = $this->item_model->criar($item);
                    
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
        
        public function index_delete()
        {
            // Recupera o ID diretamente da URL
            $id = (int) $this->uri->segment(3);
            
            // Valida o ID
            if ($id <= 0)
            {
                // Define a mensagem de retorno
                $this->response(NULL, REST_Controller::HTTP_BAD_REQUEST); // BAD_REQUEST (400)
            }
            // Executa a remoção do registro no banco de dados
            $delete = $this->item_model->deletar($id);

            if($delete === FALSE) {
                $this->response(0, REST_Controller::HTTP_OK);
            } else {
                $this->response(1, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
    }
