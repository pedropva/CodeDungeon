<?php
/* Model that represents Sys_rooms at database */

class Modelrooms extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('rooms tabela');
		$this->db->where('tabela.pmk_room', $idTable);
		$this->db->where('tabela.room_is_active', 'Sim');
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){

		$where = array('tabela.room_is_active' => 'Sim');
		if(isset($tableParam['pmk_room'])){ $where += array('tabela.pmk_room' => $tableParam['pmk_room']); }
		
		$this->db->select('*');
		$this->db->from('rooms tabela');
		$this->db->where($where); 
		$this->db->order_by("tabela.room_number", "asc");
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
            $query_string = $this->db->insert_string('rooms', $tableParam);
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
			$idTable = $tableParam['pmk_room'];
			
			$this->db->where('pmk_room', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('rooms');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['room_is_active'] = 'Nao';
		$tableParam['pmk_room'] = $idTable;
		
		$this->db->where('pmk_room', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('rooms');
	}
}
