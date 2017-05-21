<?php

class Modelloginsecure extends CI_Model {

	public function verifica_login($user_usuario, $dsPassword) {
	
		$this->db->select('*');
		$this->db->from('usuarios tabela');
		$this->db->where('tabela.user_usuario', $user_usuario);
		$this->db->where('tabela.user_senha', MD5($dsPassword) );
		$this->db->where('tabela.user_is_ativo', 'Sim');
		$this->db->limit(1);

		$query = $this->db->get();
        
		if($query->num_rows() == 1) {
			return $query->result();
		} else {
			return false;
		}
        
	}
	
	public function verifica_sessao($nivel_acesso=NULL){
		// Verifica se existe sessão para algum usuário logado, evitando alguem entrar
		if (isset($this->session->userdata)) {
			if (
			(!(array_key_exists("user_tipo", $this->session->userdata)))||
			($this->session->userdata('base_url') != base_url()) ) { 
				return 0;
			} else { 
				// SEGURANÇA - Level de acesso
				if (isset($nivel_acesso)){
					if($this->session->userdata['user_tipo'] > $nivel_acesso) { return 0; }
					else {return 1;}
				}else {return 1;}
			}
		} else { 
			return 0;  
		}
    }
	
	public function session_criar() { 
		if ($this->session->all_userdata() ){
			$fields = $this->session->all_userdata();
			$fields['pmk_usuario'] = $this->session->userdata('pmk_usuario');
			$this->db->insert('sys_sessions_painel',$fields);
			$insert_id = $this->db->insert_id();
			
			return $insert_id;
		} else {
			return false;
		}
	}
	
	public function session_carregar($session_id) {
		$this->db->select('*');
		$this->db->from('sys_sessions_painel');
		$this->db->where('session_id', $session_id);
		$this->db->order_by("pmk_sys_sessions", "DESC"); 
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function backup($tableParam = ''){
		// SEGURANÇA - Impedir acesso a área restrita
		if ($this->home->sessao_verificar(1) == 0){
			return 0;
		}
		
		// Carrega a classe DB utility 
		$this->load->dbutil();
		
		// Lista de tabelas
		$tables = $this->db->query("SHOW TABLES FROM `reservai`")->result_array();   
		$backupGeral = '';
		if($tables){
			foreach ($tables as $key => $tabela){
				if (
					($tabela['Tables_in_reservai'] != "sys_sessions_painel") &&
					($tabela['Tables_in_reservai'] != "cidades") &&
					($tabela['Tables_in_reservai'] != "estados")
					){
					$prefs = array( 'tables'=> array($tabela['Tables_in_reservai']),'format' => 'txt');
					$backupGeral .= $this->dbutil->backup($prefs);
				}
			}
		}
		// carrega o helper File e cria um arquivo com o conteúdo do backup
		$this->load->helper('file');
		if (!write_file('assets/backup/'.date("Y-m-d-H-i-s").'-mybackup.sql', $backupGeral)) {
			return 0;
		} else {
			return 1;
		}
	}
	
}
