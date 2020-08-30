$(function(){
// 一级导航
var gsps_header_nav_ul_ul=$('.gspz nav .ul_1 li');
if (gsps_header_nav_ul_ul.find('ul').length>=1){
	gsps_header_nav_ul_ul.find('ul').hide();
}
gsps_header_nav_ul_ul.hover(function(){
	if ($(this).find('ul').length>=1){
		$(this).find('ul').show();
		$(this).find('a i').css({'transform':'rotate(180deg)','transition':'all 0.5s'});
	}
},function(){
    $(this).find('ul').hide();
	$(this).find('a i').css({'transform':'rotate(0deg)','transition':'all 0.5s'});
});
// 顶部循环公告
var gsps_section_div_ul=$('.gspz section div ul');
var dbxhgg_dsq;
if (gsps_section_div_ul.find('li').length>1) {
	dbxhgg_dsq=setInterval(dbxhgg_dsq_sj,4000);
	gsps_section_div_ul.find('li img').bind("click",function(){
		gsps_section_div_ul=$('.gspz section').css('height','0');
		clearInterval(dbxhgg_dsq);
	});
}
	// 循环事件
	function dbxhgg_dsq_sj () {
		var xzz=gsps_section_div_ul.find('.section_xzz');
		var gsps_section_div_ul_li=gsps_section_div_ul.find('li');
		var index=xzz.index();
		//xzz.hide();
		xzz.removeClass('section_xzz');
		console.log();
		if (index==gsps_section_div_ul_li.length-1) {
			//gsps_section_div_ul_li.eq(0).show();
			gsps_section_div_ul_li.eq(0).addClass('section_xzz');
		}else{
			//gsps_section_div_ul_li.eq(index+1).show();
			gsps_section_div_ul_li.eq(index+1).addClass('section_xzz');
		}
	}
// 右侧导航条
	// 触碰事件
	$('.dht_yce ul:nth-of-type(1)>li').hover(function() {
		$('.dht_yce ul:nth-of-type(2)>li').eq($(this).index()).show().css('top',38*$(this).index());
	},function(){
		$('.dht_yce ul:nth-of-type(2)>li').eq($(this).index()).hide().css('top',0);
	});
	// 返回顶部
	$('.dht_yce ul:nth-of-type(1)>li').eq(0).bind("click",function(){
		$('html , body').animate({scrollTop: 0},'slow');
	});
	// 返回底部
	$('.dht_yce ul:nth-of-type(1)>li').eq(3).bind("click",function(){
		$('html , body').animate({scrollTop: $('footer.dbjs').offset().top},'slow');
	});
// 搜索屏障
	// 显示
		// 一级导航-点击事件
		$('header.gspz>nav>ul.ul_2>li').eq(0).find('a').bind("click",function(){
			$('div.div-tmpz_background').show();
			$('div.div-sspz').show();
		});
		// 右侧导航条-点击事件
		$('div.dht_yce>ul').eq(0).find('li').eq(2).find('a').bind("click",function(){
			$('div.div-tmpz_background').show();
			$('div.div-sspz').show();
		});
	// 隐藏
	$('div.div-sspz>div.sspz_srk').bind("click",function(e){
		e.stopPropagation();
	});
	$('div.div-sspz').bind("click",function(e){
		$('div.div-sspz>div.sspz_srk>input[name="sspz_input-ssgjc"]').val('');
		$('div.div-tmpz_background').hide();
		$(this).hide();
	});
	// 回车键搜索
	$('div.div-sspz>div.sspz_srk>input[name="sspz_input-ssgjc"]').bind("keydown",function(e){
		// 回车键
		if(e.keyCode==13){
			console.log('搜索内容:'+$(this).val());
			$(this).val('');
		}
	});
// 登陆注册屏障
	// 显示
	$('header.gspz>nav>ul.ul_2>li').eq(1).find('a').bind("click",function(){
		$('div.div-tmpz_background').show();
		$('div.div-dlzcpz').show();
	});
	// 隐藏
	$('div.div-dlzcpz>div.dlzcpz_srk').bind("click",function(e){
		e.stopPropagation();
	});
	$('div.div-dlzcpz').bind("click",function(e){
		$('div.div-tmpz_background').hide();
		$(this).hide();
	});








});