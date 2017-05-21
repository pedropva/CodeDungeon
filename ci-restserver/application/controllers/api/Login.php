<?php
    require(APPPATH.'libraries/REST_Controller.php');
    use Restserver\Libraries\REST_Controller;
    
    class Login extends REST_Controller {
        
        function __construct($config = 'rest'){
            parent::__construct($config);
            
            $this->load->model('../models/Modelusuarios', 'user_model');
            $this->load->model('../models/Modelloginsecure', 'loginsecure');
        }
        
        // Essa função vai responder pela rota /api/usuarios sob o método GET
        function index_get()
        {
            if ($this->session->userdata) {
                if (array_key_exists("pmk_usuario", $this->session->userdata)) {
                    $this->response($this->session->userdata['pmk_usuario'], REST_Controller::HTTP_OK); // 200 being the HTTP response code
                } else {
                    $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
                }
            } else {
                $this->response(NULL, REST_Controller::HTTP_NO_CONTENT);
            }
        }

        // Criar ou editar
        function index_post()
        {
            // recupera os dados informados no formulário
            $usuario = $this->post();
            $user_usuario = $usuario['user_usuario'];
            $user_senha = $usuario['user_senha'];
            
            // CRIA a sessão/login
            if(($user_usuario!="") && ($user_senha!="")) {
                //Field validation succeeded.  Validate against database
                $result = $this->loginsecure->verifica_login($user_usuario, $user_senha);
                
                if($result) {
                    $dadossessao  = array();
                    foreach($result as $row) {
                        $dadossessao  = array(
                            'pmk_usuario' => $row->pmk_usuario,
                            'user_usuario' => $row->user_usuario,
                            'base_url' => base_url()
                        );
                        $this->session->set_userdata($dadossessao);
                        print_r($dadossessao); echo "1-<br>";
                        print_r($this->session->userdata); echo "2-<br>";
                        die;
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
