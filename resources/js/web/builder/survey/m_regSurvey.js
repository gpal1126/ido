function selectCategory(n, category){
	  $('.second_cat_container').css('display','');
      $('#category1').val(category); //대분류 카테고리
      var name = new Array();
      var id = new Array();
      $('.wrap').css('display','none');
      $('.side_button_container').css('display','none');
      $('.second_cat_container').append('<ul class="list"><li class="left"></li><li class="right"></li></ul>')
      switch (n) {
        case 1:
          name = ['가방_bag','네일아트_nail','다이어트_diet', '메이크업_makeup','문신/타투_tattoo','바디용품_bodyProducts','보습용품_shareProducts','상의_top','샤워용품_showerProducts','신발_shoes','아우터_outer','아웃도어_outdoor','애견미용_petBeauty','액세서리_accessary','언더웨어_underwear','코디_codi','트레이닝_training','하의_bottom','향수_perfume','헤어용품_hairProducts','화장품_cosmetics','기타_fashionEtc'];
          break;
        case 2:
          name = ['각 나라별 음식_foreignFood','관광명소_touristAttraction','국내여행_domesticTrip','레시피_recipe','맛집_tasteAttraction','베이커리_bakery','슬로우푸드_slowfood','여행사_travelAgency','여행준비_readyTrip','요리_dish','제철음식_seasonFood','주류_alcohols','촬영명소_cameraAttraction','캠핑_camping','크루즈_cruz','여행 팁_tourTip','패스트푸드_fastfood','편의점_convenienceStore','해외여행_overseasTrip','기타_foodEtc'];
          break;
        case 3:
          name = ['PC/패키지게임_pcGame','RC_rc','도서_book','레고_lego','모바일게임_mobileGame','보드게임_boardGame','사진_photo','애니_animation','연극/뮤지컬_musical','영화_movie','온라인게임_online_game','요가_yoga','웹툰_webtoon','음악_music','인터넷방송_internetBroadcastic','춤_dance','콘솔게임_consoleGame','팁_hobbyTip','프라모델_plaModel','피규어_figure','기타_hobbyEtc'];
          break;
        case 4:
          name = ['가구/인테리어_furniture','경제_economic','날씨_weather','가전제품_digital','반려동물_pet','부동산_property','생활/건강_health','스포츠/레저_sports','식품_foods','아이디어상품_ideaProducts','연애_relationship','의류_clothes','이웃_neighborhood','잡화_merchandise','출산/육아_birth',
          '카페_cafe','해외직구_buyForeign','홈쇼핑_homeshopping','화장품/미용_cosmetic','기타_lifeEtc'];
          break;
        case 5:
          name = ['고시_notification','남북관계_northKorea','보수_conservatism','선거_election','수능_test','어학연수_languageStudy','역사_history','영어_english','외국어_foreignLanguage','자격증_certification','정책_policy','진보_progress','청와대_blueHouse','프로그래밍_programming','기타_eduEtc'];
          break;
        case 6:
          name = ['PC 주요부품_pcComponent','건강/뷰티가전_healthAppliances','계절가전_seasonAppliances','디지털 완제품_digitalAppliances','디지털카메라_camera','멀티미디어/네트워크_multiMedia','생활가전_lifeAppliances','소모품/소프트웨어_software','스마트폰_smartphone','이어폰/MP3_mp3','주방가전_livingAppliances','주방용품_livingThings','주변기기_etcAppliances','캠코더_camcoder','테블릿_tablet','프로젝터_projector','기타_digitalEtc'];
          break;
        case 7:
          name = ['국산차_kCar','대중교통_publicTransit','드라이브_drive','선박_ship','수입차_fCar','오토바이_bike','자동차용품_carComponent','자전거_bicycle','중고차_uCar','튜닝_tuning','항공_airplane','기타_carEtc'];
          break;
        case 8:
          name = ['가수_singer','드라마_drama','배우_actor','시사/다큐_currentEvent','연예_entertainment','예능_artisticTalents','코미디언_comedian','화제의인물_issuePerson','기타_entertainmentEtc'];
          break;    
        case 9:
          name = ['E-스포츠_eSports','건강식품_healthFood','골프_golf','국내야구_kBaseball','국내축구_kFootball','농구/배구_basketball','일반_general','해외야구_fBaseball','해외축구_fFootball','헬스케어_healthcare','기타_sportsEtc'];
        break;    
    }
    for(i in name){
      var c_name = name[i].split('_')[0]; //중분류 한글 id값
      var c_name2 = name[i].split('_')[1]; //중분류 영문 id값 
      var c_id = name[i].split('_')[1]
      if(i % 2 == 0){
		$('.left').append('<div class="second_category_div" id='+c_id+'><img src="/img/mobile/builder/survey/reg_survey/cate_div_bullet.png">&nbsp&nbsp<span id="'+c_name+'_'+c_name2+'">'+c_name+'</span></div>');
      }else{
		$('.right').append('<div class="second_category_div" id='+c_id+'><img src="/img/mobile/builder/survey/reg_survey/cate_div_bullet.png">&nbsp&nbsp<span id="'+c_name+'_'+c_name2+'">'+c_name+'</span></div>');
      }//if
    }
  }





