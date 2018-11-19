
 
 // var cliHeight = document.documentElement.clientHeight;

$(document).ready(function(){
     
       $("#menutest").click(function() {
          
           navopen();
       });       

       $("#closemm").click(function() { 
          navclose(); 
       });


       $("#contentClose").click(function() { 
          contentEnd(); 
       });

   
    $("#openSearch").click(function() { 
        $(".search_div").animate({width:'toggle'},350);
    }); 


    $("#search_close").click(function() { 
        $("#search_div").hide(); 
    }); 



     $("#pppppp").click(function () { 
           contentpop(); 
     });  
    
      $("#mask").on("mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll", function(e) {
        e.preventDefault();
        return;
      });
  
    $(".rank_content_wrap").hover(function() {  
        $(this).parent().find(".rank_add_wrap").slideDown('normal').show(); 
        $(this).parent().hover(function() {  
        }, function(){  
            $(this).parent().find(".rank_add_wrap").slideUp('fast');  
        });  
     });  
  
     $("#joinOpen").click(function () {
         $("#menu_nav").animate({right:'-320px'},'100'); 
         $("#joinContain").css({'z-index':'9000'}).animate({top:'70px'},'100').load("view/main/join/join_step01.html");
          
     });
 

     $("a[name=joinoff]").click(function () {
          $("#joinContain").animate({top:'-1000px'},'100');   
          $('#menu_nav').animate({right:'0px'},'100');
     });


     
  
  

    function navopen() { 
      //var maskHeight = $(document).height();
      var maskWidth = $(window).width();
      var maskHeight = $(document).height(); 
       
      $('#mask').fadeIn('slow').css({'width':maskWidth,'height':maskHeight,'display':'block'});	
      $('#menu_nav').css({'display':'block','height':maskHeight}).animate({right:'0px'},'100');

      // $(window).bind('touchmove', handler);   
    }
	 

    function navclose() { 

     $("#mask").fadeOut('slow');
     $("#menu_nav").animate({right:'-320px'},'100'); 

    }
    




  function contentEnd () { 


      $('#mask').fadeOut('slow'); 
      $(".contentpop_wrap").css({'display':'none'});
      

    
   }


}); 
 
  

 