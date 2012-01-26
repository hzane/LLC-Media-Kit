 
/**
 * MVMedia Interactive Media Kit v0.1
 * 01/19/2012 Multiview Inc,
 * 
 */

 /**** SETUP VARS HERE! ***/
var feedName = 'data/dma-site.xml';
var startPage = 'inventory';

//*** Global nav animation ***//
var globalNavPointer;
var currentSelection;
var pointerTargetX = 0;
var pointerInMotion = false;
var pointerAnimationHandler;


var mediaKit = {/*** Retrieves xml feed, runs template manager, attach onclick actions ****/
	init: function() {
	$(window).unload( function () {} );
	mediaKit.loadPage(startPage, 'none');
	mediaKit.setupLinks();
	},
	loadPage: function(pageName, animationMethod){
		$.get(feedName, function(xml){
		mediaKit.site = $.xml2json(xml);
		var template = 'templates/'+pageName+'.html';
				$.get(template, function(data) {
				var res = tmpl(data, mediaKit.site);
				
				if(animationMethod=='none'){
				$('div#container').html(res);
				document.title = mediaKit.site.siteTitle;
				
	$('body, section, div').bind('mousedown.welcome', function() {
	$('#inventory-stage .welcome-message').animate({
    opacity: 0.25,
    height: '0'
  }, {queue:false, duration:600, easing: 'easeInExpo'}, function() {
	$('body, section, div').unbind('mousedown.welcome');
	$('#inventory-stage .welcome-message').remove();
  });  
  
	
	});
	
				mediaKit.setupArrowSubNav();
				mediaKit.setupVirtualIpad(); // do we need to provision for non-inventory pages??? //divergent paths and a neat-o controller function
				
				mediaKit.initPresentationArrows('firstInit');//*** ADDED BY MIKE (1/25/12) - presentation buttons call ***//
				globalNavPointer = $('.header-edge-pointer');
				console.log(globalNavPointer);
				mediaKit.setPointerTargetX('#' + startPage + '_mainNav');
				
				
				$(window).resize(function(){mediaKit.setPointerX(); mediaKit.initPresentationArrows();}); //*** ADDED BY MIKE (1/25/12) replaced this resize function ***//
				}
				});
		
			return true;
	});
	},
	setupLinks: function(){//super quick page navigation
		$('a.slideChange').live('click', function(){
		var relPage = $(this).attr('rel');
		mediaKit.loadPage(relPage, 'none');
		mediaKit.setPointerTargetX(this);
		});
	},
	setPointerTargetX: function(selected_btn){//*** GLOBAL NAV POINTER ANIMATION FUNCTIONS ***//
		currentSelection = selected_btn;
		pointerTargetX = $(selected_btn).offset().left + (($(selected_btn).width() - $(globalNavPointer).width())/2);
		if(!pointerInMotion){
			pointerAnimationHandler = setInterval(mediaKit.animatePointer, 30);
			pointerInMotion = true;
		}
	},
	animatePointer: function(){
		if(globalNavPointer != null){
			var currentX = globalNavPointer.offset().left
			var distanceToTarget = (pointerTargetX - currentX);
			var addAmount = (distanceToTarget / 6);
			globalNavPointer[0].style.left = currentX + addAmount + 'px';
			if(distanceToTarget < 1 && distanceToTarget > -1){
				globalNavPointer[0].style.left = pointerTargetX + 'px';
				clearInterval(pointerAnimationHandler);
				pointerInMotion = false;
			}
		}
	},
	setPointerX: function(){
		console.log('resize');
		if(!pointerInMotion && currentSelection != null){
			pointerTargetX = $(currentSelection).offset().left + (($(currentSelection).width() - $(globalNavPointer).width())/2);
			globalNavPointer[0].style.left = pointerTargetX + 'px';
		}
	},
	shiftIpadScreen: function(whereTo){ 					//*** ADDED BY MIKE (1/25/12)***//
		var target = 0;
		switch (whereTo){
			case "player":
			break;
			case "home":
			target = 510;
			break;
		}
		$('#homeScreen').animate({left:(target-510)}, 300, function(){});
	},
	initPresentationArrows: function(e){					//*** ADDED BY MIKE (1/25/12)***//
		var prevArrowX = $('#ipad').offset().left - $('#presentationPrev').width() - 80;
		var nextArrowX = $('#ipad').offset().left + $('#ipad').width() + $('#presentationPrev').width() + 80;
		var leftArrow = $('#presentationPrev');
		var rightArrow = $('#presentationNext');
		leftArrow.css({'left': prevArrowX});
		rightArrow.css({'left': nextArrowX});
		if(e=='firstInit'){
			leftArrow.css({'opacity': 0});
			rightArrow.css({'opacity': 0});
			setTimeout(function(){		
			leftArrow.animate({'opacity': 0.7}, 1000, function(){});
			rightArrow.animate({'opacity': 0.7}, 1000, function(){});
			}, 2000);
			
			leftArrow.click(function(){
				var prevSubSelection = $('ul li.selected').prev();
				if(prevSubSelection != undefined){
					prevSubSelection.trigger('click');
				}
			});
			rightArrow.click(function(){
				var nextSubSelection = $('ul li.selected').next();
				if(nextSubSelection != undefined){
					nextSubSelection.trigger('click');
				}
			});
		}		
	},
	setupVirtualIpad: function(){ //sets up interactive ipad on inventory screen
		// fade screen images
		//$("#ipadScreen .screen").fadeTo(0,0.5);
		
		window.zoomAni = setInterval(function() {
			$("#ipadScreen a .zoom").each(function(i){
				$(this).delay(i*200).fadeTo(300, 0.5, function(){
					$(this).delay(100).fadeTo(300, 1);
				});
			});
		}, 3000);
		
		// set bg, fade ads, ad events
		$("#ipadScreen a .img").each(function() {
			
			var par = $(this).parent(),
				screen = par.siblings(".screen"),
				src = screen.attr('src');
			
			// set bg image				
			$(this).css('background-image','url('+src+')');
			
			// Click ad event
			$(this).add(this.nextSibling).click(function(event){
				if (!par.is('.active')) {
					var c = par.attr('class').replace('ad_','').replace('zoom ','');
					$('#'+c).trigger('click');
					
					var arrow = $('nav.nav-sub').find('img.pointerArrowSml');
					var p = $('nav.nav-sub ul li').find('li.selected').position();
					$(arrow).stop(true, true).animate({top:p.top}, 200, function(){});
					//return false;

				}				
			});
			
			// parent rollover effect
			$(this).parent().hover(function(){
				// hover in
				screen.clearQueue().fadeTo(300, 0.5);
				$(this).siblings('a').clearQueue().fadeTo(300,0);
				$(this).find('.zoom').fadeTo(0,0);
			},function(){
				// hover out
				screen.clearQueue().fadeTo(300, 1);
				$(this).siblings('a').clearQueue().fadeTo(300,1);
				$(this).find('.zoom').fadeTo(0,1);
			});
			
		});
		
		$("a.fancybox").fancybox({
			'titlePosition'	: 'inside',
			'opacity'		: true,
			'overlayShow'	: true,
			'transitionIn'	: 'elastic',
			'transitionOut'	: 'elastic',
		});
		
		
		// setup draggables 	
		$('.draggable').draggable({ axis: 'y', snapMode: 'both' }).bind( "dragstop", function(event, ui) {
		  
		  var height = -$(this).height(),
		  	  top = ui.position.top,
		  	  parHeight = $(this).parent().height();
		  
		  // SlideContainer rebound
		  if ($(this).is('#ipadWrap') && height > top - parHeight + 50) {
		  	
		  	$(this).animate({top:height+parHeight-50}, 300, 'swing');
		  
		  } 
		  // iPadScreen rebound
		  else if (!$(this).is('#ipadWrap') && height > top - parHeight) {
		  
		  	  $(this).animate({top:height+parHeight}, 300, 'swing');
		  			  
		  }
		  // Top rebound (both)
		  else if (top > 0) {
		    
		    $(this).animate({top:0}, 300, 'swing');
		  
		  }
		  
		  // Keep child drag from triggering parrent
		  //event.stopPropagation();
		  		  
		}); 
				
		// Sub Nav actions
		
		$("nav.nav-sub li").each(function() {
		
			$(this).click(function() {
				
				var c = $(this).attr('rel').split(',')[2],
					y1 = $(this).attr('rel').split(',')[0],
					y2 = $(this).attr('rel').split(',')[1],
					ad = $('#ipadScreen .'+c),
					bg = ad.siblings('.screen').attr('src');
					
				// y1 = container position 
				$("#ipadWrap").animate({top:y1}, 300);
				// y2 = screen position
				$("#ipadScreen .draggable").animate({top:y2}, 300);
				
				// hide ads
//				$('#ipadScreen a').each(function(){
//					$(this).removeClass('active').find('.img').fadeTo(0, 0)
//				});
				
				// show triggered ad
				ad.addClass('active').find('.img').fadeTo(0,1);
				
//				 Remove active class
//				$(this)
//				.parent()
//				.siblings()
//				.add(this.parentNode)
//				.find('a').removeClass('active');
//				
//				 Add active class to selected
//				$(this).addClass('active');
				
			});
			
		})
		//.eq(0).trigger('click'); // first link make active on load
		
	},
	setupArrowSubNav: function(){
	var dircheck = $('nav.nav-sub').attr('rel');
	if(dircheck=='vertical'){
	
	$('nav.nav-sub').prepend('<img class="pointerArrowSml" src="images/blueSelArrow.png" style="position:absolute; z-index:2; display:none;" />');
	function hoverItem(){
	$('nav.nav-sub').find('img.pointerArrowSml').fadeIn()
		var arrow = $(this).parents('nav.nav-sub').find('img.pointerArrowSml');
		var p = $(this).position();
		$(arrow).stop(true, true).animate({
		top:p.top
		}, 200, function(){});
	}
	function hoverOut(){
			
		if($(this).hasClass('selected')){}else{
		
			var arrow = $(this).parents('nav.nav-sub').find('img.pointerArrowSml');
			var curSel = $(this).parent('ul').find('li.selected');
			var p = $(curSel).position();
			
			if($(arrow).is(':animated')){}else{
				$(arrow).delay('500').animate({
				top:p.top
				}, 650, function(){});
			}
		}
		
	}
	var config = {    
     over: hoverItem,
     timeout: 0, 
     out: hoverOut
};

$("nav.nav-sub ul").find('li').hoverIntent(config);
	}
$("nav.nav-sub ul").find('li').click(function(){
$(this).parent('ul').find('li.selected').removeClass('selected');
$(this).addClass('selected');
var zoomid = 'a.ad_'+$(this).attr('id');
$(zoomid).trigger('click');
});


	}

}//end mediaKit var