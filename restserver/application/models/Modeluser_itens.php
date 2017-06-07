<?php
/* Model that represents Sys_user_itens at database */

class Modeluser_itens extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('user_itens tabela');
		$this->db->where('tabela.pmk_useritem', $idTable);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function carregar_por_usuario_item ($fok_user, $fok_item){
		
		$this->db->select('*');
		$this->db->from('user_itens tabela');
		$this->db->where('tabela.fok_user', $fok_user);
		$this->db->where('tabela.fok_item', $fok_item);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function listar($tableParam = ''){
        
		$this->db->select('*');
		$this->db->from('user_itens tabela');
		$this->db->join('itens item', 'item.pmk_item = tabela.fok_item');
		$this->db->join('users usua', 'usua.pmk_usuario = tabela.fok_user');
		 
		if(isset($tableParam['pmk_useritem'])){ 
            $where = array('tabela.pmk_useritem' => $tableParam['pmk_useritem']);
            $this->db->where($where);
        } 
		if(isset($tableParam['fok_user'])){ 
            $where = array('tabela.fok_user' => $tableParam['fok_user']);
            $this->db->where($where);
        }
		$this->db->order_by("item.item_name", "asc");
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
			$this->db->insert('user_itens',	$tableParam);
			$insert_id = $this->db->insert_id();		
			return $insert_id;
		} else {
			return false;
		}
	}
    
	public function editar ($tableParam) {
	
		if (isset($tableParam)){
			$idTable = $tableParam['pmk_useritem'];
			
			$this->db->where('pmk_useritem', $idTable);
			$this->db->set($tableParam);
			
			return $this->db->update('user_itens');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['pmk_useritem'] = $idTable;
		
		$this->db->where('pmk_useritem', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->delete('user_itens');
	}
}
