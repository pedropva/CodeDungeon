<?php
/* Model that represents Sys_usuario_itens at database */

class Modelusuario_itens extends CI_Model {
	
	public function carregar ($idTable){
		
		$this->db->select('*');
		$this->db->from('usuario_itens tabela');
		$this->db->where('tabela.pmk_useritem', $idTable);
		
		$this->db->limit(1);
		$query = $this->db->get();

		if($query->num_rows() == 1) {
			return $query->result_array();
		} else {
			return false;
		}
	}
	
	public function carregar_por_usuario_item ($fok_usuario, $fok_item){
		
		$this->db->select('*');
		$this->db->from('usuario_itens tabela');
		$this->db->where('tabela.fok_usuario', $fok_usuario);
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
		$this->db->from('usuario_itens tabela');
		$this->db->join('itens item', 'item.pmk_item = tabela.fok_item');
		$this->db->join('usuarios usua', 'usua.pmk_usuario = tabela.fok_usuario');
		 
		if(isset($tableParam['pmk_useritem'])){ 
            $where = array('tabela.pmk_useritem' => $tableParam['pmk_useritem']);
            $this->db->where($where);
        }
		$this->db->order_by("item.item_nome", "asc");
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
			$this->db->insert('usuario_itens',	$tableParam);
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
			
			return $this->db->update('usuario_itens');
		} else {
			return false;
		}
	}
	
	public function deletar ($idTable) {
		$tableParam['pmk_useritem'] = $idTable;
		
		$this->db->where('pmk_useritem', $idTable);
		$this->db->set($tableParam);
		
		return $this->db->delete('usuario_itens');
	}
}
