<?php
/* Model that represents Sys_users at database */

class Modelusers extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('users tabela');
		$this->db->where('tabela.pmk_user', $idTable);
		$this->db->where('tabela.user_is_active', 'Y');
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){

		$where = array('tabela.user_is_active' => 'Y');
		if(isset($tableParam['pmk_user'])){ $where += array('tabela.pmk_user' => $tableParam['pmk_user']); }
		
		$this->db->select('*');
		$this->db->from('users tabela');
		$this->db->where($where); 
		$this->db->order_by("tabela.user_name", "asc");
		if (isset($like)) {
			$this->db->like($like);
		}
		$query = $this->db->get();

		if($query->num_rows() > 0) {
			return $query->result_array();
		} else {
			return false;
		}
    }
	
	public function criar($tableParam) { 
		        
        if (isset($tableParam)){
            $query_string = $this->db->insert_string('users', $tableParam);
            $query_string = str_replace('INSERT INTO','INSERT IGNORE INTO',$query_string);
            $this->db->query($query_string);
            $insert_id = $this->db->insert_id();
            return $insert_id;
		} else {
			return false;
		}
	}
    
	public function editar ($tableParam) {
	
		if (isset($tableParam)){
			$idTable = $tableParam['pmk_user'];
			
			$this->db->where('pmk_user', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('users');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['user_is_active'] = 'N';
		$tableParam['pmk_user'] = $idTable;
		
		$this->db->where('pmk_user', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('users');
	}
}
