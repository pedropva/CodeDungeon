<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Init_database extends CI_Migration {

    public function up()
    {
        $queries = explode('---', file_get_contents(APPPATH . 'migrations/' . '001.sql'));
        foreach ($queries as $query) $this->db->query($query);
    }

    public function down()
    {
        $this->dbforge->drop_table('usuarios');
        $this->dbforge->drop_table('bosses');
        $this->dbforge->drop_table('itens');
        $this->dbforge->drop_table('logs');
        $this->dbforge->drop_table('rooms');
		$this->dbforge->drop_table('usuario_bosses');
		$this->dbforge->drop_table('usuario_itens');
		$this->dbforge->drop_table('usuario_rooms');
    }

}
