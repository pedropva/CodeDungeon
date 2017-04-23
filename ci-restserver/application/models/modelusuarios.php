<?php
/* Model that represents Sys_usuarios at database */

class Modelusuarios extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('usuarios tabela');
		$this->db->where('tabela.pmk_usuario', $idTable);
		$this->db->where('tabela.user_is_ativo', 'Sim');
		
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
		if(isset($tableParam['pmk_usuario'])){ $where += array('tabela.pmk_usuario' => $tableParam['pmk_usuario']); }
		if(isset($tableParam['newLimit'])){ $this->db->limit($tableParam['newLimit'],0); } else { $this->db->limit(100,0); }
		
		$this->db->select('*');
		$this->db->from('usuarios tabela');
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
            $query_string = $this->db->insert_string('usuarios', $tableParam);
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
			$idTable = $tableParam['pmk_usuario'];
			
			$this->db->where('pmk_usuario', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('usuarios');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['user_is_ativo'] = 'Nao';
		$tableParam['pmk_usuario'] = $idTable;
		
		$this->db->where('pmk_usuario', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->update('usuarios');
	}
}
