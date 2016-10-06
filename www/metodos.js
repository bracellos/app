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
        var url_site = 'http://localhost/app_android/painel/ws/';
       // $(function() {

            navigator.splashscreen.hide();

            $('.menu-anchor').on('click touchstart', function(e){
                $('html').toggleClass('menu-active');
                e.preventDefault();
            });

            $('.navint').live('click', function(){
                var id = $(this).attr('rel');
                var link = $(this).attr('href');
                link = link.replace('#','');
                $('a').removeClass('ativo');
                $('a[href="#'+link+'"]').addClass('ativo');
                $("#alvo").fadeOut(500,function(){
                    $("#alvo").load(link+".html", function(a){
                        $(this).fadeIn(500).html(a);
                        if(link.substr(0,3) != 'ver'){
                            $('.menu-anchor').click();
                        }
                        $('#big-video-wrap').remove();
                        postsRecents(id);
                    });
                });
                return false;
            });

            window.setTimeout(function(){
                $("#alvo").load("inicio.html", '.navint', function(a){
                    $(this).fadeIn("slow").html(a);
                    $('#big-video-wrap').fadeToggle("slow");
                    $('a[href="#inicio"]').addClass('ativo');
                    postsRecents();
                });
            }, 5000);


            function postsRecents(id){
                $.ajax({
                  url : url_site+'webservice.php',
                  crossDomain: false,
                  dataType : 'json',
                  type : 'POST',
                  data: {
                    token: '8b54dfb3e9a0450f0eeba565e1a244c4', 
                    metodo: 'listPost',
                    from_igreja: 1,
                  },
                  success: function(ret) {
                    var totalReg = ret.length;
                    var article = "";
                    for(i = 0; i < totalReg; i++){

                        if(id){
                            switch(ret[i].tipo){
                                case 'txt':
                                    article += '<article rel="'+ret[i].id+'">';
                                        article += '<a href="#verconteudo" class="navint">';
                                            article += '<img src="'+ret[i].midia+'" width="100%">';
                                            article += '<header>';
                                                article += '<h3>'+ret[i].titulo+'</h3>';
                                                '<time>'+ret[i].data+'</time>';
                                            article += '</header>'
                                            article += ret[i].texto;
                                        article += '</a>';
                                    article += '</article>';                       
                                break;
                                
                                case 'img':

                                break;

                                case 'mpg':

                                break;

                                case 'mp3':

                                break;
                            }
                        }else{
                            switch(ret[i].tipo){
                                case 'txt':
                                    article += '<article rel="'+ret[i].id+'">';
                                        article += '<a href="#verconteudo" class="navint">';
                                            article += '<img src="'+ret[i].midia+'" width="100%">';
                                            article += '<header>';
                                                article += '<h3>'+ret[i].titulo+'</h3>';
                                                '<time>'+ret[i].data+'</time>';
                                            article += '</header>'
                                            article += ret[i].texto;
                                        article += '</a>';
                                    article += '</article>';                       
                                break;
                                
                                case 'img':

                                break;

                                case 'mpg':

                                break;

                                case 'mp3':

                                break;
                            }
                        }
                    }
                    $('.alvoInicio').html(article);
                  }
                });
            }

            $('#alvo').ready(function(){  
                var BV = new $.BigVideo();
                BV.init();
                BV.show('video.mp4',
                    {
                        ambient:true,
                        controls:false,
                        useFlashForFirefox:true,
                        doLoop:false
                    });            
            })
       // })
    }
};
