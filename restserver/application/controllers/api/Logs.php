<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class Logs extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelusers', 'user_model');
            $this->load->model('../models/Modellogs', 'log_model');
			// Tabelas base
            $this->load->model('../models/Modelitens', 'itens_model');
            $this->load->model('../models/Modelmonsters', 'monsters_model');
            $this->load->model('../models/Modelrooms', 'rooms_model');
			// Tabelas adicionais do usuário
            $this->load->model('../models/Modeluser_itens', 'user_itens_model');
            $this->load->model('../models/Modeluser_monsters', 'user_monsters_model');
            $this->load->model('../models/Modeluser_rooms', 'user_rooms_model');
			
        }
      
      
        // Listar
        function index_get()
        {
            $id = (int) $this->uri->segment(3);
			
			//$id é do usuário
            // Se tem ID carrega
            if($id > 0) {
                
                $paramLog['fok_user'] = $id;
                $logsArr = $this->user_model->listar($paramLog);
                    
                if($logsArr) {
                    $this->response($logsArr, REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else { // Senão, listar
                $logsArr = $this->user_model->listar();
                
                if($logsArr) {
                    $this->response($logsArr, REST_Controller::HTTP_OK);
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            }
        }
		
        // Criar
        function index_post()
        {
            // recupera os dados informados no formulário
            $log = $this->post();
			
            // Se tem ID edita, senão, cria
            if ($log) {
                $result = $this->log_model->criar($log);
				
				// Se criou o novo log
                if($result > 0) {
                    $this->response(1, REST_Controller::HTTP_OK);
                } else {
                    $this->response(0, FALSE);
                }
            }
        }
		
    }
