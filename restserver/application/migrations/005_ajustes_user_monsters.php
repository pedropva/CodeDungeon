<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Ajustes_User_Monsters extends CI_Migration {

    public function up()
    {
        $queries = explode('---', file_get_contents(APPPATH . 'migrations/' . '005.sql'));
        foreach ($queries as $query) $this->db->query($query);
    }

    public function down()
    {
    }

}
