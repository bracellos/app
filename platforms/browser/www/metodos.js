var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var codInstituicao = 1; //codigo da instituição no banco de dados
        var token = '8b54dfb3e9a0450f0eeba565e1a244c4';
      
        $(function() {

            function loader(display){
                var alt = $(window).height();
                var lar = $(window).width();
                $('#loader').width(lar);
                $('#loader').height(alt);

                if(display == 'none'){
                    $('#loader').css({
                        'display': 'none'
                    });
                }else{
                    $('#loader').css({
                        'display': 'block'
                    });
                }
            }

            function checkConnection() {
                var networkState = navigator.connection.type;
             
                var states = {};
                states[Connection.UNKNOWN]  = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI]     = 'WiFi connection';
                states[Connection.CELL_2G]  = 'Cell 2G connection';
                states[Connection.CELL_3G]  = 'Cell 3G connection';
                states[Connection.CELL_4G]  = 'Cell 4G connection';
                states[Connection.CELL]     = 'Cell generic connection';
                states[Connection.NONE]     = 'No network connection';
             
               // alert('Connection type: ' + states[networkState]);

               return states[networkState];
            }

            if(checkConnection() == 'No network connection'){
                alert('Você não tem conexão com a internet no momento. O aplicativo será fechado!');
                navigator.app.exitApp();
            }

            //registrar app
            function registraApp(){
                var pushNotification;
                pushNotification = window.plugins.pushNotification;
                try 
                { 
                    pushNotification = window.plugins.pushNotification;
                    pushNotification.register(successHandler, errorHandler, {"senderID":"274707851267","ecb":"onNotification"});        // required!

                }
                catch(err) 
                { 
                    txt="Um erro ocorreu.\n\n"; 
                    txt+="Descrição do erro: " + err.message + "\n\n"; 
                    alert(txt); 
                } 
                
                // handle GCM notifications for Android
                function onNotification(e) {                
                    switch( e.event )
                    {
                        case 'registered':
                        if ( e.regid.length > 0 ){         
                            $.ajax({
                                url : 'http://www.agenciamamuth.com.br/appandroid/ws/webservice.php',
                                crossDomain: false,
                                dataType : 'json',
                                data : {metodo:registraDevice, reg:e.regid,token:token},
                                type : 'GET',
                                success : function(data){
                                    alert(data);
                                },
                                complete: function(){
                                    
                                }
                            });                      
                        }
                        break;
                        
                        case 'message':
                            // if this flag is set, this notification happened while we were in the foreground.
                            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                            if (e.foreground){
                                var soundfile = e.soundname || e.payload.sound;
                                var my_media = new Media("/android_asset/www/"+ soundfile);
                                my_media.play();
                            }
                        break;
                        
                        case 'error':
                            alert('algo deu errado');
                        break;
                        
                        default:

                        break;
                    }
                }
                function tokenHandler (result) {

                }
                
                function successHandler (result) {
                }
                
                function errorHandler (error) {

                }                
                           
            }

            $('.menu-anchor').on('click touchstart', function(e){
                $('html').toggleClass('menu-active');
                e.preventDefault();
            });

            $('.navint').live('click', function(){
                var link = $(this).attr('href');
                link = link.replace('#','');
                $('a').removeClass('ativo');
                $('a[href="#'+link+'"]').addClass('ativo');
                switch(link){
                    case 'inicio':
                        postsRecents('n','ULTIMAS POSTAGENS');
                    break;
                    case 'avisos':
                        postsRecents('img','IMAGENS');
                    break;
                    case 'audio':
                        postsRecents('mp3','ÁUDIOS');
                    break;
                    case 'video':
                        postsRecents('mpg','VÍDEOS');
                    break;
                    case 'localizacao':
                        maps();
                    break;
                    case 'contato':
                        contato();
                        break;
                    default:
                        about();
                }
                $('.menu-anchor').click();
                return false;
            });

            function maps(){   
                loader('block');
                $('#alvo').html('');     
                $('#alvo').append('<h2>ONDE ESTAMOS</h2><div id="mapa"></div>');

                var altura = $(window).height() - 130;
                $('#mapa').height(altura);


                var map;
                document.addEventListener("deviceready", function() {
                  var div = document.getElementById("mapa");

                  // Initialize the map view
                  map = plugin.google.maps.Map.getMap(div);

                  // Wait until the map is ready status.
                  map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
                }, false);

                function onMapReady() {
                    loader('none');
                    onBtnClicked();
                }

                function onBtnClicked() {

                  // Move to the position with animation
                  map.animateCamera({
                    target: {lat: -26.91008815, lng: -48.70049351},
                    zoom: 17,
                    bearing: 140,
                    duration: 5000
                  }, function() {

                    // Add a maker
                    map.addMarker({
                      position: {lat: -26.91008815, lng: -48.70049351},
                      title: "Igreja da Verdade \n" +
                             "Avenida Campos Novos, 1019 | São Vicente | Itajaí/SC",
                      snippet: "",
                      animation: plugin.google.maps.Animation.BOUNCE
                    }, function(marker) {

                      // Show the info window
                      marker.showInfoWindow();

                      // Catch the click event
                      marker.on(plugin.google.maps.event.INFO_CLICK, function() {

                        // To do something...
                        location.href="geo:-26.91008815,-48.70049351?q=-26.91008815,-48.70049351";

                      });
                    });
                  });
                }
                 
            }

            function contato(){
                loader('block');
                $('#alvo').html('');  
                var formulario = '';   
                formulario += '<form class="enviaRecado">';
                  formulario += '<input type="hidden" name="token" value="'+token+'" />';
                    formulario += '<input type="hidden" name="metodo" value="enviaContato" />';
                    formulario += '<input type="hidden" name="from_igreja" value="'+codInstituicao+'" />';
                    formulario += '<input type="text" name="nome" class="inteiro nome" placeholder="Nome" required/>';
                    formulario += '<input type="email" name="email" class="inteiro email" placeholder="E-mail" required/>';
                    formulario += '<textarea name="mensagem" class="inteiro recado" placeholder="Mensagem" required></textarea>';
                    formulario += '<button type="submit">ENVIAR MENSAGEM</button>';
                formulario += '</form>';

                loader('none');
                $('#alvo').append('<h2>FALE CONOSCO</h2><div id="contato">'+formulario+'</div>');

                $('.enviaRecado').live('submit',function(){
                    $(this).find('button').addClass('loader');
                    var form = $(this).serialize();
                    $.ajax({
                        url : 'http://www.agenciamamuth.com.br/appandroid/ws/webservice.php',
                        crossDomain: false,
                        dataType : 'json',
                        data : form,
                        type : 'GET',
                        success : function(data){
                            if(data.status != 'no'){
                                apprise('<span class="resposta-ok"><i class="fa fa-check-circle" aria-hidden="true"></i> &nbsp;'+data.mensagem+'</span>', {'animate':true});
                            }else{
                                apprise('<span class="resposta-no"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> &nbsp; '+data.mensagem+'</span>', {'animate':true});
                            }
                        },
                        complete: function(){
                            $('button').removeClass('loader');
                        }
                    });

                    return false;
                }); 

            }


            function about(){
                $('#alvo').html('');     
                $('#alvo').append('<h2>DESENVOLVEDOR</h2>');

                var about = '';

                about += '<div class="about">';
                    about += '<img src="images/logodev.png" width="100%" />';
                    about += '<div><i class="fa fa-mobile" aria-hidden="true"></i> 47 9114 6000</div>';
                    about += '<div><i class="fa fa-whatsapp" aria-hidden="true"></i> 47 9728 7402</div>';
                    about += '<div><i class="fa fa-envelope" aria-hidden="true"></i> <a href="mailto:contato@queroaplicativo.com">contato@queroaplicativo.com</a></div>';
                    about += '<div><i class="fa fa-mobile" aria-hidden="true"></i> <a href="#" id="abresite">www.queroaplicativo.com</a></div>';
                about += '</div>';

                $("#abresite").live("click",function(){
                    if (typeof navigator !== "undefined" && navigator.app) {
                        // Mobile device.
                        navigator.app.loadUrl('http://www.queroaplicativo.com', {openExternal: true});
                    } else {
                        // Possible web browser
                        window.open("http://www.queroaplicativo.com", "_blank");
                    }
                });                

                $('#alvo').append(about);



            }

            function postsRecents(tipo,titulo){
                loader('block');
                $('#alvo').html('');     
                $.ajax({
                  url : 'http://www.agenciamamuth.com.br/appandroid/ws/webservice.php',
                  crossDomain: false,
                  dataType : 'json',
                  type : 'GET',
                  data: {
                    token: token, 
                    metodo: 'listPost',
                    fromIgreja: codInstituicao,
                    tipo: tipo
                  },
                  success: function(ret) {
                    var article = '';
                    var totalReg = ret.length;    
                    for(i = 0; i < totalReg; i++){             
                        switch(ret[i].tipo){
                            case 'txt':
                                article += '<article rel="'+ret[i].id+'">';
                                    article += '<h3>'+ret[i].titulo+'</h3>';
                                    article += '<time>'+ret[i].data+'</time>';
                                    article += ret[i].texto;
                                article += '</article>';                       
                            break;
                            
                            case 'img':
                                article += '<article rel="'+ret[i].id+'">';
                                    article += '<h3>'+ret[i].titulo+'</h3>';
                                    article += '<time>'+ret[i].data+'</time>';
                                    article += '<img src="http://www.agenciamamuth.com.br/appandroid/upload/midia/'+ret[i].midia+'" width="100%" class="midia">';
                                    article += ret[i].texto;
                                article += '</article>';     
                            break;

                            case 'mpg':
                                article += '<article rel="'+ret[i].id+'">';
                                    article += '<h3>'+ret[i].titulo+'</h3>';
                                    article += '<time>'+ret[i].data+'</time>';
                                    var video = ret[i].video.replace('https://www.youtube.com/watch?v=','https://www.youtube.com/embed/');
                                    article += '<iframe width="100%" src="'+video+'" class="midia" frameborder="0" allowfullscreen></iframe>';
                                    article += ret[i].texto;
                                article += '</article>';  
                            break;

                            case 'mp3':
                                article += '<article rel="'+ret[i].id+'">';
                                    article += '<h3>'+ret[i].titulo+'</h3>';
                                    article += '<time>'+ret[i].data+'</time>';
                                    article += '<audio controls width="100%" class="midia"><source src="http://www.agenciamamuth.com.br/appandroid/upload/midia/'+ret[i].midia+'" type="audio/mpeg"></audio>';
                                    article += ret[i].texto;
                                article += '</article>';  
                            break;

                            default:
                        }
                    }
                    loader('none');
                    $('#alvo').html(article);
                    $('#alvo').prepend('<h2>'+titulo+'</h2><div id="mapa"></div>');                
                  }
                });
            }
            postsRecents('n','ULTIMAS POSTAGENS'); 
            loader('none');
            registraApp();

        })
    }
};
