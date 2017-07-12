<?php defined("BASEPATH") or exit("No direct script access allowed");

class Migration extends CI_Controller{

    /**
     *  DOCUMENTAÇÃO
     *  http://www.codeigniter.com/userguide2/libraries/migration.html
     *  http://www.codeigniter.com/userguide2/database/forge.html
    */

    public function index()
    {
        $this->load->library("Migration");

        if(!$this->migration->latest())
        //if(!$this->migration->version(0))
        {
           show_error($this->migration->error_string());
        }

        echo 'Migration realizada com sucesso';
    }
}
