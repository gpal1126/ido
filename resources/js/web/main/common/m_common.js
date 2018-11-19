
 
 // var cliHeight = document.documentElement.clientHeight;

$(document).ready(function(){
     
       $("#menutest").click(function(e) {
    	   console.log('menuOopen')
    	   
          navopen(); 
    	   $('body').on('scroll touchmove mousewheel', function(e) {
      			e.preventDefault();
      			e.stopPropagation(); 
      		});
          $('#mask').click(function(){
            navclose();
          })
       });       

       $("#closemm").click(function() { 
          navclose(); 
          $('body').off('scroll touchmove mousewheel');
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
         //location.href = "/m_join/join_step1";
         location.href = "/m_join/join_user";
     });
 

     $("a[name=joinoff]").click(function () {
          $("#joinContain").animate({top:'-1000px'},'100');   
          $('#menu_nav').animate({right:'0px'},'100');
     });


     
  
  

    function navopen() { 
      //var maskHeight = $(document).height();
      var maskWidth = $(window).width() - 220;
      var maskHeight = $(document).height(); 
      console.log(maskWidth)
      $('#mask').fadeIn('slow').css({'width':maskWidth,'height':maskHeight,'display':'block'});	
      $('#menu_nav').css({'display':'block','height':maskHeight}).animate({right:'0px'},'100');
  
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
 
  

 