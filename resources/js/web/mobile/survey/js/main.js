window.onload = function () {

  'use strict';
  var Cropper = window.Cropper;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var dataRotate = document.getElementById('dataRotate');
  var dataScaleX = document.getElementById('dataScaleX');
  var dataScaleY = document.getElementById('dataScaleY');
  var options = {
        aspectRatio: 11/16,
        preview: '.img-preview',
        ready: function (e) {
          //console.log(e.type);
        },
        cropstart: function (e) {
          //console.log(e.type, e.detail.action);
        },
        cropmove: function (e) {
         // console.log(e.type, e.detail.action);
        },
        cropend: function (e) {
         // console.log(e.type, e.detail.action);
        },
        crop: function (e) {
          var data = e.detail;

          console.log(e.type);
         /* dataX.value = Math.round(data.x);
          dataY.value = Math.round(data.y);
          dataHeight.value = Math.round(data.height);
          dataWidth.value = Math.round(data.width);
          dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
          dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
          dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';*/
        },
        zoom: function (e) {
          console.log(e.type, e.detail.ratio);
        }
      };
  var cropper = new Cropper(image, options);

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }


  // Download
  if (typeof download.download === 'undefined') {
    download.className += ' disabled';
  }


  // Options
  actions.querySelector('.docs-toggles').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var isCheckbox;
    var isRadio;

    if (!cropper) {
      return;
    }

    if (target.tagName.toLowerCase() === 'span') {
      target = target.parentNode;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.getElementsByTagName('input').item(0);
    }

    isCheckbox = target.type === 'checkbox';
    isRadio = target.type === 'radio';

    if (isCheckbox || isRadio) {
      if (isCheckbox) {
        options[target.name] = target.checked;
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();

        options.ready = function () {
          console.log('ready');
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        };
      } else {
        options[target.name] = target.value;
        options.ready = function () {
          console.log('ready');
        };
      }

      // Restart
      cropper.destroy();
      cropper = new Cropper(image, options);
    }
  };


  // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var result;
    var input;
    var data;
    var i = $('#answer_id_value').val();

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option'),
      secondOption: target.getAttribute('data-second-option')
    };

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === 'getCroppedCanvas') {
        data.option = JSON.parse(data.option);
      }

      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            if (!download.disabled) {
              download.href = result.toDataURL('image/jpeg');
              var surveyId = getUrlParameter('surveyId');
              var clickCount = $('#clickCount').val();
              console.log("clickCount : "+clickCount);
             /* $('#select_'+clickCount).attr('src', download.href)
              console.log(download.href);*/
              console.log('크롭');
              $('#select_'+clickCount).css('background-image', 'url(' + download.href + ')')
              $('#img'+clickCount).attr('src', download.href); 
              $('.wrap').css('display','none')
              console.log('url 뽑아오기 ::'+location.href.substring((location.href.lastIndexOf('/')+1)).split('?')[0] );
              var updateURL_chk = location.href.substring((location.href.lastIndexOf('/')+1)).split('?')[0];
              if(updateURL_chk=='update_survey_type'){//수정일 때
            	  console.log('수정할 때');
              }else {//등록할 때 
            	  console.log('등록할 때');
            	  $('#infoInputBtn_'+clickCount).remove(); //정보입력버튼 삭제
            	  $('#modifyInputBtn_'+clickCount).remove(); //수정버튼 삭제
            	  $('#insert_info_div'+clickCount).remove();
            	  $('#a_'+clickCount).append('<div class="info_input_btn" id="infoInputBtn_'+clickCount+'" style="display:none;"><img src="/img/mobile/builder/survey/reg_survey/make_addbt1.png"></div>'+
            			  					 '<div class="modify_input_btn" id="modifyInputBtn_'+clickCount+'" style="display:none;"><img src="/img/mobile/builder/survey/reg_survey/make_addbt2.png"></div>'+
            	  							'</div>');
              }
              
              $('#infoInputBtn_'+clickCount).css('display','');
              
            }
          }

          break;

        case 'destroy':
          cropper = null;
          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }

    }
  };

  document.body.onkeydown = function (event) {
    var e = event || window.event;

    if (!cropper || this.scrollTop > 300) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        e.preventDefault();
        cropper.move(-1, 0);
        break;

      case 38:
        e.preventDefault();
        cropper.move(0, -1);
        break;

      case 39:
        e.preventDefault();
        cropper.move(1, 0);
        break;

      case 40:
        e.preventDefault();
        cropper.move(0, 1);
        break;
    }
  };


  // Import image

  var inputImage = document.getElementById('inputImage');
  var URL = window.URL || window.webkitURL;
  var blobURL;

  if (URL) {
    $(document).on('change', 'input[type=file]', function() {
      var che = $(this).attr('id').split('surveyImagePath')[1];
      console.log(che);
      if(che != null || typeof che != 'undefined'){
    	  $('#clickCount').val($(this).attr('id').split('surveyImagePath')[1]);  
      }else{
    	  console.log($(this).attr('id').split('surveyImagePath')[1])
    	  $('#clickCount').val($(this).attr('id').split('surveyImagePath')[1]);
      }
     
      $('.wrap').css('display','')
      $('.wrap').css('z-index','1000')
      $('.img-container').css('display','')
      var files = this.files;
      var file;
      
      if (cropper && files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          blobURL = URL.createObjectURL(file);          
          cropper.reset().replace(blobURL);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    });
   
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }
  
  //취소 버튼 클릭
  $('.wrap').on('click', 'button#cancel', function(){	
	  $('.wrap').css('display', 'none');
  });
};
