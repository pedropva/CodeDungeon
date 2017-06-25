<?php
/* Model that represents Sys_user_monsters at database */

class Modeluser_monsters extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('user_monsters tabela');
		$this->db->where('tabela.pmk_user_monster', $idTable);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){

		$where = array('tabela.user_monster_is_active' => 'Y');
		if(isset($tableParam['pmk_user_monster'])){ $where += array('tabela.pmk_user_monster' => $tableParam['pmk_user_monster']); }
		if(isset($tableParam['fok_user'])){ $where += array('tabela.fok_user' => $tableParam['fok_user']); }
		
		$this->db->select('*');
		$this->db->from('user_monsters tabela');
		$this->db->where($where); 
		$this->db->order_by("tabela.user_usuario", "asc");
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
			$idTable = $tableParam['pmk_user_monster'];
			
			$this->db->where('pmk_user_monster', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('user_monsters');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['user_monster_is_active'] = 'N';
		$tableParam['pmk_user_monster'] = $idTable;
		
		$this->db->where('pmk_user_monster', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('user_monsters');
	}
}
