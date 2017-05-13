<?php
    defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>REST Server Tests</title>
        
        <style>
            ::selection { background-color: #E13300; color: white; }
            ::-moz-selection { background-color: #E13300; color: white; }
            
            body {
            background-color: #FFF;
            margin: 40px;
            font: 16px/20px normal Helvetica, Arial, sans-serif;
            color: #4F5155;
            word-wrap: break-word;
            }
            
            a {
            color: #039;
            background-color: transparent;
            font-weight: normal;
            }
            
            h1 {
            color: #444;
            background-color: transparent;
            border-bottom: 1px solid #D0D0D0;
            font-size: 24px;
            font-weight: normal;
            margin: 0 0 14px 0;
            padding: 14px 15px 10px 15px;
            }
            
            code {
            font-family: Consolas, Monaco, Courier New, Courier, monospace;
            font-size: 16px;
            background-color: #f9f9f9;
            border: 1px solid #D0D0D0;
            color: #002166;
            display: block;
            margin: 14px 0 14px 0;
            padding: 12px 10px 12px 10px;
            }
            
            #body {
            margin: 0 15px 0 15px;
            }
            
            p.footer {
            text-align: right;
            font-size: 16px;
            border-top: 1px solid #D0D0D0;
            line-height: 32px;
            padding: 0 10px 0 10px;
            margin: 20px 0 0 0;
            }
            
            #container {
            margin: 10px;
            border: 1px solid #D0D0D0;
            box-shadow: 0 0 8px #D0D0D0;
            }
        </style>
    </head>
    <body>
        
        <div id="container">
            <h1>REST Server Tests</h1>
            
            <div id="body">
                <p>
                    See the article
                    <a href="http://net.tutsplus.com/tutorials/php/working-with-restful-services-in-codeigniter-2/" target="_blank">
                        http://net.tutsplus.com/tutorials/php/working-with-restful-services-in-codeigniter-2/
                    </a>
                </p>
                <p>Click on the links to check whether the REST server is working.</p>
                
                <ol>
                    <li><a href="<?php echo base_url('api/users'); ?>">LIst Users</a> - JSON</li>
                </ol>
                <h3>Criar Item</h3>
                <div id="result"></div>
                <form role="form" id="formCriar" action="../ci-restserver/api/usuario_itens/" method="post" class="registration-form">
                    <div class="form-group">
                        <label class="sr-only" for="form-first-name">Usuario</label>
                        <input type="text" name="fok_usuario" placeholder="UsuÃ¡rio" class="form-first-name form-control" id="form-first-name">
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-first-name">Item</label>
                        <input type="text" name="fok_item" placeholder="Item" class="form-first-name form-control" id="form-item">
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-first-name">Caught</label>
                        <input type="text" name="useritem_caught" placeholder="Item" class="form-first-name form-control" id="form-useritem_caught">
                    </div>
                    <div class="form-group">
                        <label class="sr-only" for="form-first-name">Drop</label>
                        <input type="text" name="useritem_room_drop" placeholder="Item" class="form-first-name form-control" id="form-useritem_room_drop">
                    </div>
                    <button type="submit" class="btn">Cadastrar</button>
                </form>
            </div>
            
            <p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds. <?php echo  (ENVIRONMENT === 'development') ?  'CodeIgniter Version <strong>'.CI_VERSION.'</strong>' : '' ?></p>
        </div>
        
        <script src="https://code.jquery.com/jquery-1.12.0.js"></script>
        
        <script type="text/javascript">
            $( "#formCriar" ).submit(function( event ) {
                event.preventDefault(); // Stop form from submitting normally
                
                // Get some values from elements on the page:
                var $form = $( this ),
                usuario = $form.find( "input[name='fok_usuario']" ).val(),
                item = $form.find( "input[name='fok_item']" ).val(),
                caught = $form.find( "input[name='useritem_caught']" ).val(),
                drop = $form.find( "input[name='useritem_room_drop']" ).val(),
                url = $form.attr( "action" );
                
                $( "#result" ).empty().append( "" );
                
                // Send the data using post
                var posting = $.post( 
                url, { fok_usuario: usuario, fok_item: item, useritem_caught: caught, useritem_room_drop: drop } 
                ).done(function( data ) {
                    var content = "";
                    
                    if (data=="1") { content = ''+
                        '<div class="alert btn-success alert-dismissible">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>'+
                        'Cadastro realizado com sucesso</div>';
                        } else { content = ''+
                        '<div class="alert btn-warning alert-dismissible">'+
                        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">X</button>'+
                        'Problema ao cadastrar usuário. (Já existe este nome de usuário)</div>';
                    }
                    $( "#result" ).empty().append( content );
                });
            });
        </script>
        
        
        <script>
            // Create an 'App' namespace
            var App = App || {};
            
            // Basic rest module using an IIFE as a way of enclosing private variables
            App.rest = (function restModule(window) {
                // Fields
                var _alert = window.alert;
                var _JSON = window.JSON;
                
                // Cache the jQuery selector
                var _$ajax = null;
                
                // Cache the jQuery object
                var $ = null;
                
                // Methods (private)
                
                /**
                    * Called on Ajax done
                    *
                    * @return {undefined}
                    */
                    function _ajaxDone(data) {
                        // The 'data' parameter is an array of objects that can be iterated over
                        _alert(_JSON.stringify(data, null, 2));
                    }
                    
                    /**
                        * Called on Ajax fail
                        *
                        * @return {undefined}
                        */
                        function _ajaxFail() {
                            _alert('Oh no! A problem with the Ajax request!');
                        }
                        
                        /**
                            * On Ajax request
                            *
                            * @param {jQuery} $element Current element selected
                            * @return {undefined}
                            */
                            function _ajaxEvent($element) {
                                $.ajax({
                                    // URL from the link that was 'clicked' on
                                    url: $element.attr('href')
                                })
                                .done(_ajaxDone)
                                .fail(_ajaxFail);
                            }
                            
                            /**
                                * Bind events
                                *
                                * @return {undefined}
                                */
                                function _bindEvents() {
                                    // Namespace the 'click' event
                                    _$ajax.on('click.app.rest.module', function (event) {
                                        event.preventDefault();
                                        
                                        // Pass this to the Ajax event function
                                        _ajaxEvent($(this));
                                    });
                                }
                                
                                /**
                                    * Cache the DOM node(s)
                                    *
                                    * @return {undefined}
                                    */
                                    function _cacheDom() {
                                        _$ajax = $('#ajax');
                                    }
                                    
                                    // Public API
                                    return {
                                        /**
                                            * Initialise the following module
                                            *
                                            * @param {object} jQuery Reference to jQuery
                                            * @return {undefined}
                                            */
                                            init: function init(jQuery) {
                                                $ = jQuery;
                                                
                                                // Cache the DOM and bind event(s)
                                                _cacheDom();
                                                _bindEvents();
                                            }
                                        };
                                    }(window));
                                    
                                    // DOM ready event
                                    $(function domReady($) {
                                        // Initialise the App module
                                        App.rest.init($);
                                    });
                                </script>
                                
                            </body>
                        </html>
                                        