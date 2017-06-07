<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class Login extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelusers', 'user_model');
            $this->load->model('../models/Modelloginsecure', 'loginsecure');
        }
        
        // Essa função vai responder pela rota /api/usuarios sob o método GET
        function index_get()
        {
            if ($this->session->userdata) {
                if (array_key_exists("pmk_user", $this->session->userdata)) {
                    $this->response($this->session->userdata['pmk_user'], REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else {
                $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
            }
        }

        // Criar
        function index_post()
        {
            // recupera os dados informados no formulário
            $usuario = $this->post();
            $user_name = $usuario['user_name'];
            $user_pass = $usuario['user_pass'];
            
            // CRIA a sessão/login
            if(($user_name!="") && ($user_pass!="")) {
                //Field validation succeeded.  Validate against database
                $result = $this->loginsecure->verifica_login($user_name, $user_pass);
                
                if($result) {
                    $dadossessao  = array();
                    foreach($result as $row) {
                        $dadossessao  = array(
                            'pmk_user' => $row->pmk_user,
                            'user_name' => $row->user_name,
                            'base_url' => base_url()
                        );
                        $this->session->set_userdata($dadossessao);
                    }
                    redirect("../../../../");
                } else {
                    $this->session->set_flashdata('login_flash', 'Login/Senha incorreto');
                    redirect("../../../../frontclient");
                }
            // Consulta se existe essa sessão/login
            } else {
                redirect("../../../../frontclient");
            }
        }
        
        public function index_delete()
        {
            // LOGOUT
            $user_data = $this->session->all_userdata();
            foreach ($user_data as $key => $value) {
                if ($key != 'session_id' && $key != 'ip_address' && $key != 'user_agent' && $key != 'last_activity') {
                    $this->session->unset_userdata($key);
                }
            }
            $this->session->sess_destroy();
            $_SESSION = array();
            redirect("../".base_url()."/frontclient/");
        }
        
    }
