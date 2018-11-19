function result_chart(index, type){
	$('body').off('scroll touchmove mousewheel');
/*	var color1 =  ['#fcf777','#ffd08c','#c0ff8d', '#8beafe', '#d75088', '#f88d9d', '#fff78c', '#fa8f9f'];
	var color2 =  ['rgb(217, 80, 138)','rgb(254, 149, 7)','rgb(254, 247, 120)', 'rgb(106, 167, 134)', 'rgb(53, 194, 209)'];
	var color3 =  ['rgb(64, 89, 128)','rgb(149, 165, 124)','rgb(217, 184, 162)', 'rgb(191, 134, 134)', 'rgb(179, 48, 80)'];
	var color4 =  ['rgb(193, 37, 82)','rgb(255, 102, 0)','rgb(245, 199, 0)', 'rgb(106, 150, 31)', 'rgb(179, 100, 53)'];
	var color5 =  ['rgb(192, 255, 140)','rgb(255, 247, 140)','rgb(255, 208, 140)', 'rgb(140, 234, 255)', 'rgb(255, 140, 157)'];
	*/
	var color =  ['#fcf777','#ffd08c','#c0ff8d', '#8beafe', '#d75088', '#f88d9d', '#fff78c', '#fa8f9f'];
	var options = {
    	    chart: {
    	        renderTo: 'result_chart_contents',
    	        type: 'pie'
    	    },
    	    title: {
                text: ''
            },
           colors: [],
    	    tooltip: {
                pointFormat: '{series.name}'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: ''
                }

            },
    	    plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'black'
                        }
                    },
                    startAngle: 0,
                    endAngle: 360,
                    center: ['50%', '50%']
                }
            },
    	    series: [{
    	    	type: 'pie',
                innerSize: '60%',
                name:[],
                data: [
                      
                   ],
               borderWidth: 0,
               dataLabels: {
                   enabled: true,
                   
               }
    	    }],
    	    dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                }
            }
    	};
    
	if(type == 'choose'){
		console.log('--------------- 양자택일형 ---------------')
		console.log(index)
		var max = 0;
		var percent = 0;
		for(i in index){
			max+=index[i].COUNT;
		}
		var ar = new Array();
		for(j in index){
			
			var fm = new Array();
			percent = index[j].COUNT / max * 100; //백분율 계산
			fm.push($('#c'+index[j].PER+'').val()+'   '+Math.ceil(percent)+'%'); //차트 Name 값 
			fm.push(percent); // 백분율 값 
			options.chart.renderTo ='wrap_'+index[0].PER
			options.colors.push(color[j])
			options.series[0].data.push(fm) //option 변경하는 부분	
			
		}
		options.title.text = index[0].SECOND_SURVEY_TITLE;
		console.log('index[0].SECOND_SURVEY_TITLE::'+index[0].SECOND_SURVEY_TITLE);
	
		var chart = new Highcharts.Chart(options);
	}else if(type =='etc'){
		
		console.log('contentsId : ' + index)
		$(function () {
	    	//console.log(Math.ceil(percent));
	        $('#result_chart_contents').highcharts({
	            title: {
	                text: '다가오는 가을! 마음에 드는 코디는?'
	            },
	            tooltip: {
	                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	            },
	            plotOptions: {
	                pie: {
	                    dataLabels: {
	                        enabled: true,
	                        distance: -50,
	                        style: {
	                            fontWeight: 'bold',
	                            color: 'white',
	                            textShadow: '0px 1px 2px black'
	                        }
	                    },
	                    startAngle: 0,
	                    endAngle: 360,
	                    center: ['50%', '50%']
	                }, series: {
	                    borderWidth: 0,
	                    dataLabels: {
	                        enabled: true,
	                        format: '{point.y:.1f}%'
	                    }
	                }
	            },
	            series: [{
	                type: 'pie',
	                innerSize: '60%',
	                data: [
	                    ['임블리',       60],
	                    ['스타일닷컴', 10],
	                    ['스타일난다',    20],
	                ]
	            }]
	        });
	    });
	}else if(type =='single'){
		console.log('--------------- 단수선택형 ---------------')
		var max = 0;
		var percent = 0;
		for(i in index){
			max+=index[i].COUNT;
		}
		var ar = new Array();
		
		for(j in index){
			console.log('선택형 : '+$('#s'+index[j].PER+'').val());
			var fm = new Array();
			percent = index[j].COUNT / max * 100; //백분율 계산
			fm.push($('#s'+index[j].PER+'').val()+'   '+Math.ceil(percent)+'%'); //차트 Name 값 
			fm.push(percent); // 백분율 값 
			options.colors.push(color[j])
			options.chart.renderTo ='wrap_'+index[0].PER
			options.series[0].data.push(fm) //option 변경하는 부분	
		}
		options.title.text = index[0].SECOND_SURVEY_TITLE;
		console.log('index[0].SECOND_SURVEY_TITLE::'+index[0].SECOND_SURVEY_TITLE);
		var chart = new Highcharts.Chart(options);
	}else if(type =='select'){
		console.log('--------------- 복수선택형 ---------------')
		
		for(j in index){
			console.log(index[j].PER);
			console.log('복수선택형 : '+$('#select'+index[j].PER+'').val());
			var fm = new Array();
			percent = index[j].PERCENT
			fm.push($('#select'+index[j].PER+'').val()+'   '+percent+'%'); //차트 Name 값 
			fm.push(percent); // 백분율 값 
			options.colors.push(color[j])
			options.chart.renderTo ='wrap_'+index[0].PER
			options.series[0].data.push(fm) //option 변경하는 부분	
		}
		options.title.text = index[0].SECOND_SURVEY_TITLE;
		var chart = new Highcharts.Chart(options);
	}else if(type =='rank'){
		console.log('--------------- 순위형 ---------------')
		var max = 0;
		var percent = 0;
		for(i in index){
			max+=index[i].count;
		}
		
		for(j in index){
			console.log(index[0].PER)
			
			//wrap_index[j].PER
			var fm = new Array();
			percent = index[j].count / max * 100; //백분율 계산
			fm.push($('#r'+index[j].PER+'').val()+'   '+Math.ceil(percent)+'%'); //차트 Name 값 
			fm.push(percent); // 백분율 값 
			options.colors.push(color[j])
			options.chart.renderTo ='wrap_'+index[0].PER
			
			options.series[0].data.push(fm) //option 변경하는 부분	
		}
		options.title.text = index[0].SECOND_SURVEY_TITLE;
				console.log(options);
		var chart = new Highcharts.Chart(options);
		
	}else if(type =='star'){
		console.log('--------------- 별점형 ---------------')
		var max = 0;
		var percent = 0;
		var data = new Array(); //데이터들 담기위한 Array(name, value, color)
		
		for(i in index){
			for(j in index[i]){
				console.log('Value : '+index[i][j].value);
				//percent = index[i][j].value / index[i][j].count; //백분율 계산
				
				options.series[0].data.push({"name": $('#star'+index[i][j].PER+'').val(), "y": Math.round(index[i][j].value.toFixed(1)), "color":color[i]})
				options.chart.renderTo ='wrap_'+index[j][0].PER
				options.title.text = $('#st_title'+index[i][0].PER).val()
				console.log(index[i][j]);
			}
			
			if(parseInt(i)+1 == index.length){
				options.series[0].type = 'column' //option 변경하는 부분
				
			}
		}
		var chart = new Highcharts.Chart(options);
		console.log(index);
	}
	
	$('.statistics_ul li').css('display','none');
	$("ul li:nth-child(1)").css('display','');
	$(".result_chart_Wrap ul li:nth-child(1)").append('<img src="/img/mobile/main/chart/b_arrow_ico.png" style="width:10px; height:10px; padding-left:10px; padding-top:3px;">')
	/*$('.surveyWrap').empty();*/ 
    $('.surveyWrap').css('display','none'); 
    $('.survey_category_button').css('display','')
    $('.result_chart_Wrap').css('display','');
	
}