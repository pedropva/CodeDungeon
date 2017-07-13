<?php
/* Model that represents Sys_user_monsters at database */

class Modeluser_monsters extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('user_monsters tabela');
		$this->db->where('tabela.pmk_usermonster', $idTable);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){

		$where = array('tabela.usermonster_is_active' => 'Y');
		if(isset($tableParam['pmk_usermonster'])){ $where += array('tabela.pmk_usermonster' => $tableParam['pmk_usermonster']); }
		if(isset($tableParam['fok_user'])){ $where += array('tabela.fok_user' => $tableParam['fok_user']); }
		
		$this->db->select('*');
		$this->db->from('user_monsters tabela');
		$this->db->where($where); 
		$this->db->order_by("tabela.fok_user", "asc");
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
			$this->db->insert('user_monsters',	$tableParam);
			$insert_id = $this->db->insert_id();		
			return $insert_id;
		} else {
			return false;
		}
	}
    
	public function editar ($tableParam) {
	
		if (isset($tableParam)){
			$idMonster = $tableParam['fok_monster'];
			$idUser = $tableParam['fok_user'];
			
			$this->db->where('fok_monster', $idMonster);
			$this->db->where('fok_user', $idUser);
			$this->db->set($tableParam);
			
			return $this->db->update('user_monsters');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['usermonster_is_active'] = 'N';
		$tableParam['pmk_usermonster'] = $idTable;
		
		$this->db->where('pmk_usermonster', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('user_monsters');
	}
}
