<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class Usuarios extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelusuarios', 'user_model');
        }
        
        // Essa função vai responder pela rota /api/usuarios sob o método GET
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
            } else { // Senão, listar
                $users = $this->user_model->listar();
                
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
            $usuario = $this->post();
            $usuario_id = $this->uri->segment(3);
            
            // Se tem ID edita, senão, cria
            if ($usuario_id > 0) {
                $usuario['pmk_usuario'] = $usuario_id;
                
                $result = $this->user_model->editar($usuario);
            
                if($result == FALSE) {
                    $this->response(0, REST_Controller::HTTP_BAD_REQUEST);
                } else {
                    $this->response(1, REST_Controller::HTTP_OK);
                }
            } else {
                $usuario['user_senha'] = MD5($usuario['user_senha']);
                $result = $this->user_model->criar($usuario);
                
                if($result > 0) {
                    $this->response(1, REST_Controller::HTTP_OK);
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
            $delete = $this->user_model->deletar($id);

            if($delete === FALSE) {
                $this->response(0, REST_Controller::HTTP_OK);
            } else {
                $this->response(1, REST_Controller::HTTP_BAD_REQUEST);
            }
        }
        
    }
