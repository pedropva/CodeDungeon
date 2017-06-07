<?php

class Modelloginsecure extends CI_Model {

	public function verifica_login($user_name, $dsPassword) {
	
		$this->db->select('*');
		$this->db->from('users tabela');
		$this->db->where('tabela.user_name', $user_name);
		$this->db->where('tabela.user_pass', MD5($dsPassword) );
		$this->db->where('tabela.user_is_active', 'Sim');
		$this->db->limit(1);

		$query = $this->db->get();
        
		if($query->num_rows() == 1) {
			return $query->result();
		} else {
			return false;
		}
        
	}
	
	
}
