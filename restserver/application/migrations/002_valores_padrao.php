<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Valores_Padrao extends CI_Migration {

    public function up()
    {
        $queries = explode('---', file_get_contents(APPPATH . 'migrations/' . '002.sql'));
        foreach ($queries as $query) $this->db->query($query);
    }

    public function down()
    {
    }

}
