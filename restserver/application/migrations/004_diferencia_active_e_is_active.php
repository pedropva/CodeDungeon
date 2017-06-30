<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Diferencia_Active_E_Is_Active extends CI_Migration {

    public function up()
    {
        $queries = explode('---', file_get_contents(APPPATH . 'migrations/' . '004.sql'));
        foreach ($queries as $query) $this->db->query($query);
    }

    public function down()
    {
    }

}
