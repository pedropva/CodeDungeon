<?php
/* Model that represents Sys_itens at database */

class Modelitens extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('itens tabela');
		$this->db->where('tabela.pmk_item', $idTable);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){

		$where = array('tabela.item_is_active' => 'Sim');
		if(isset($tableParam['pmk_item'])){ $where += array('tabela.pmk_item' => $tableParam['pmk_item']); }
		if(isset($tableParam['item_current_room'])){ $where += array('tabela.item_current_room' => $tableParam['item_current_room']); }
		if(isset($tableParam['item_state'])){ $where += array('tabela.item_state' => $tableParam['item_state']); }
		
		$this->db->select('*');
		$this->db->from('itens tabela');
		$this->db->where($where); 
		$this->db->order_by("tabela.item_name", "asc");
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
			$this->db->insert('itens',	$tableParam);
			$insert_id = $this->db->insert_id();		
			return $insert_id;
		} else {
			return false;
		}
	}
    
	public function editar ($tableParam) {
	
		if (isset($tableParam)){
			$idTable = $tableParam['pmk_item'];
			
			$this->db->where('pmk_item', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('itens');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['item_is_active'] = 'Nao';
		$tableParam['pmk_item'] = $idTable;
		
		$this->db->where('pmk_item', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('itens');
	}
}
