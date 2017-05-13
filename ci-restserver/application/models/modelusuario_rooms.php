<?php
/* Model that represents Sys_usuario_rooms at database */

class Modelusuario_rooms extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('usuario_rooms tabela');
		$this->db->where('tabela.pmk_userroom', $idTable);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){

		$where = array('tabela.user_is_ativo' => 'Sim');
		if(isset($tableParam['pmk_userroom'])){ $where += array('tabela.pmk_userroom' => $tableParam['pmk_userroom']); }
		if(isset($tableParam['newLimit'])){ $this->db->limit($tableParam['newLimit'],0); } else { $this->db->limit(100,0); }
		
		$this->db->select('*');
		$this->db->from('usuario_rooms tabela');
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
			$this->db->insert('usuario_rooms',	$tableParam);
			$insert_id = $this->db->insert_id();		
			return $insert_id;
		} else {
			return false;
		}
	}
    
	public function editar ($tableParam) {
	
		if (isset($tableParam)){
			$idTable = $tableParam['pmk_userroom'];
			
			$this->db->where('pmk_userroom', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('usuario_rooms');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['user_is_ativo'] = 'Nao';
		$tableParam['pmk_userroom'] = $idTable;
		
		$this->db->where('pmk_userroom', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('usuario_rooms');
	}
}
