<?php
/* Model that represents Sys_logs at database */

class Modellogs extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('logs tabela');
		$this->db->where('tabela.pmk_log', $idTable);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){

		$where = array('tabela.user_is_ativo' => 'Y');
		if(isset($tableParam['pmk_log'])){ $where += array('tabela.pmk_log' => $tableParam['pmk_log']); }
		if(isset($tableParam['newLimit'])){ $this->db->limit($tableParam['newLimit'],0); } else { $this->db->limit(100,0); }
		
		$this->db->select('*');
		$this->db->from('logs tabela');
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
			$this->db->insert('logs',	$tableParam);
			$insert_id = $this->db->insert_id();		
			return $insert_id;
		} else {
			return false;
		}
	}
    
	public function editar ($tableParam) {
	
		if (isset($tableParam)){
			$idTable = $tableParam['pmk_log'];
			
			$this->db->where('pmk_log', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('logs');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['user_is_ativo'] = 'N';
		$tableParam['pmk_log'] = $idTable;
		
		$this->db->where('pmk_log', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('logs');
	}
}
