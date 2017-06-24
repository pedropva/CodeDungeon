<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Ajustes_Tabelas extends CI_Migration {

    public function up()
    {
        $queries = explode('---', file_get_contents(APPPATH . 'migrations/' . '003.sql'));
        foreach ($queries as $query) $this->db->query($query);
    }

    public function down()
    {
    }

}
