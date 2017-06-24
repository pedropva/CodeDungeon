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
