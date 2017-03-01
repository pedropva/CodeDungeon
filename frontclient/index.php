<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>CodeDungeon</title>
        <!-- CSS -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,500">
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/font-awesome/css/font-awesome.min.css">
		<link rel="stylesheet" href="assets/css/form-elements.css">
        <link rel="stylesheet" href="assets/css/style.css">
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
            <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
        <!-- Favicon and touch icons -->
        <link rel="shortcut icon" href="assets/ico/favicon.png">
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/ico/apple-touch-icon-144-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/ico/apple-touch-icon-114-precomposed.png">
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/ico/apple-touch-icon-72-precomposed.png">
        <link rel="apple-touch-icon-precomposed" href="assets/ico/apple-touch-icon-57-precomposed.png">
        
    </head>
    
    <body>
        
        <!-- Top content -->
        <div class="top-content">
        	
            <div class="inner-bg">
                <div class="container">
                	
                    <div class="row">
                        <div class="col-sm-8 col-sm-offset-2 text">
                            <h1><strong>CodeDungeon</strong> Login &amp; Cadastro</h1>
                            <div class="description" style="height: 100px">
                            	<p>
	                            	This is a free responsive <strong>"login and register forms"</strong> template made with Bootstrap. 
	                            	Download it on <a href="http://azmind.com" target="_blank"><strong>AZMIND</strong></a>, 
	                            	customize and use it as you like!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div id="result"></div>
                    <div class="row">
                        <div class="col-sm-5">
                        	
                        	<div class="form-box">
	                        	<div class="form-top">
	                        		<div class="form-top-left">
	                        			<h3>Login</h3>
                                    </div>
	                        		<div class="form-top-right">
	                        			<i class="fa fa-key"></i>
                                    </div>
                                </div>
	                            <div class="form-bottom">
				                    <form role="form" action="../ci-restserver/api/usuarios/login" method="post" class="registration-form">
				                    	<div class="form-group">
				                    		<label class="sr-only" for="form-username">Username</label>
				                        	<input type="text" name="user_usuario" placeholder="Username..." class="form-username form-control" id="form-username">
                                        </div>
				                        <div class="form-group">
				                        	<label class="sr-only" for="form-password">Password</label>
				                        	<input type="password" name="user_senha" placeholder="Password..." class="form-password form-control" id="form-password">
                                        </div>
				                        <button type="submit" class="btn">Entrar</button>
                                    </form>
                                </div>
                            </div>
	                        
                        </div>
                        
                        <div class="col-sm-1 middle-border"></div>
                        <div class="col-sm-1"></div>
                        
                        <div class="col-sm-5">
                        	
                        	<div class="form-box">
                        		<div class="form-top">
	                        		<div class="form-top-left">
	                        			<h3>Cadastro</h3>
                                    </div>
	                        		<div class="form-top-right">
	                        			<i class="fa fa-pencil"></i>
                                    </div>
                                </div>
	                            <div class="form-bottom">
				                    <form role="form" id="formCriar" action="../ci-restserver/api/usuarios/" method="post" class="registration-form">
				                    	<div class="form-group">
				                    		<label class="sr-only" for="form-first-name">Nome</label>
				                        	<input type="text" name="user_usuario" placeholder="First name..." class="form-first-name form-control" id="form-first-name">
                                        </div>
				                        <div class="form-group">
				                        	<label class="sr-only" for="form-email">Senha</label>
				                        	<input type="password" name="user_senha" placeholder="Senha..." class="form-email form-control" id="form-email">
                                        </div>
				                        <button type="submit" class="btn">Cadastrar</button>
                                    </form>
                                </div>
                            </div>
                        	
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
        
        <!-- Footer -->
        <footer>
        	<div class="container">
        		<div class="row">
        			
        			<div class="col-sm-8 col-sm-offset-2">
        				<div class="footer-border"></div>
                    <p>Template by <strong>AZMIND</strong> (Edited)</a></p>
                </div>
                
            </div>
        </div>
    </footer>
    
    <!-- Javascript -->
    <script src="assets/js/jquery-1.11.1.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/js/jquery.backstretch.min.js"></script>
    <script src="assets/js/scripts.js"></script>
    
    <!--[if lt IE 10]>
        <script src="assets/js/placeholder.js"></script>
    <![endif]-->
    
    <script type="text/javascript">
        $( "#formCriar" ).submit(function( event ) {
            event.preventDefault(); // Stop form from submitting normally
            
            // Get some values from elements on the page:
            var $form = $( this ),
            usuario = $form.find( "input[name='user_usuario']" ).val(),
            senha = $form.find( "input[name='user_senha']" ).val(),
            url = $form.attr( "action" );
            
            // Send the data using post
            var posting = $.post( 
                url, { user_usuario: usuario, user_senha: senha } 
            ).done(function( data ) {
                var content = "";
                alert(data);
                if (data=="1") { content = ''+
                                    '<div class="alert btn-warning alert-dismissible">'+
                                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>'+
                                    'Cadastro realizado com sucesso</div>';
                } else { content = ''+
                                    '<div class="alert btn-warning alert-dismissible">'+
                                    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>'+
                                    'Problema ao cadastrar usuário. (Usuário deve ser único)</div>';
                }
                $( "#result" ).empty().append( content );
            });
        });
    </script>
    
    
    
</body>
</html>