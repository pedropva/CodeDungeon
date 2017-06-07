<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class Monsters extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelmonsters', 'monsters');
        }
        
        // Essa função vai responder pela rota /api/itens sob o método GET
        function index_get()
        {
            $id = (int) $this->uri->segment(3);
            $get = $_GET;
            
            // Se tem ID carrega
            if($id > 0) {
                
                $user = $this->monsters->carregar( $id );
                    
                if($user) {
                    $this->response($user, REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else { // Senão, listar
                $monstersParam = $get;
                $monsters = $this->monsters->listar($monstersParam);
                
                if($monsters) {
                    $this->response($monsters, REST_Controller::HTTP_OK);
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
            $pmk_monster = 0;
            if (isset($item['pmk_monster'])) {
                $pmk_monster = $item['pmk_monster'];
            }
            
            // Se tem ID edita, senão, cria
            if ($pmk_monster > 0) {
                
                $result = $this->monsters->editar($item);
            
                if($result == FALSE) {
                    $this->response(0, REST_Controller::HTTP_BAD_REQUEST);
                } else {
                    $this->response(1, REST_Controller::HTTP_OK);
                }
            } else {
                // Se vai criar, tem que informar a sala
                $fok_room = $item['fok_room'];
                
                if ($fok_room) {
                    
                    $result = $this->monsters->criar($item);
                    
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
            $delete = $this->monsters->deletar($id);

            if($delete === FALSE) {
                $this->response(0, REST_Controller::HTTP_OK);
            } else {
                $this->response(1, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
    }
