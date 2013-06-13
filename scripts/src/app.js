	
$(document).ready(function(){
	innerPageLinkGen($('div.innerTarget'),$('a.innerLink'));	// generate innerlinks
});

function refresh(){
	$('[data-spy="scroll"]').scrollspy('refresh');
	$('.ex-sidebar').scrollable();
}

$(window).resize(function() {
	if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
		refresh();
	}, 500);
});

$(window).keydown(function(e){
	if (e.which == 37){
		var anchor = $('#up').attr('href');
		//$('body,html').animate({scrollTop:$(anchor).position().top+5},200);
		$('body,html').scrollTop($(anchor).position().top+5);
		location.hash = anchor;
	}else if (e.which == 39){
		var anchor = $('#down').attr('href');
		//$('body,html').animate({scrollTop:$(anchor).position().top+5},200);
		$('body,html').scrollTop($(anchor).position().top+5);
		location.hash = anchor;
	}
});

function innerPageLinkGen (targetlist,anchorlist){
	targetlist.each(function(i){
		$(this).attr('id','post'+i);
	});
	anchorlist.each(function(i){
		$(this).attr('href','#post'+i);        
	});
}

$.fn.setTweetCounter = function(url){

	var self = $(this),
		url = (url)? url: location.href,
		twitter_api_url = 'http://urls.api.twitter.com/1/urls/count.json',
		base_h = 'scriptogr.am/ia_archiver',
		alte_h = 'iaarchiver.net',
		scounter = self.find('span.scounter');

	$.when(
		$.ajax({
			type: 'GET',
			url: twitter_api_url,
			data: { url : encodeURI(url), noncache: new Date() },
			dataType: 'jsonp'
		}),
		$.ajax({
			type: 'GET',
			url: twitter_api_url,
			data: { url : encodeURI(url.replace(base_h,alte_h)), noncache: new Date() },
			dataType: 'jsonp'
		})
		).done(function(a1,a2){
			var base_c = (a1)?a1[0].count:0,
				alte_c = (a2)?a2[0].count:0;
			scounter
				.text(base_c+alte_c)
				.fadeTo(0,1);
		});

	compressGoogleUrl(url, function(shorturl){
		self.attr('href','https://twitter.com/share?url='+shorturl);
	})
}

var compressGoogleUrl = function(url ,callb){
	$.ajax({
		url : "http://glurl-tool.appspot.com",
		dataType : "jsonp",
		data : { url : url },
		success : function( data ){
			callb(data.error  ? false : data.id);
		}
	});
};

$.fn.setLikeCounter = function(url){
	var self = $(this),
		url = (url)? url: location.href,		
		scounter = self.find('span.scounter');

	// get like count & put in .scounter
	$.ajax({
			type: 'GET',
			url: 'http://graph.facebook.com/' + url,
			dataType: 'jsonp',
			error:function(XHR, status, errorThrown){
				console.log(status);
        	},
			success: function(data) {
					var count = (data.shares)? data.shares : 0;
					scounter
						.text(count)
						.fadeTo(0,1);
			}
	});

	// open like-button iframe if clicked
	self.toggle(function(){
		var fframe = $('<iframe>')
						.attr({
							src: 'http://www.facebook.com/plugins/like.php?layout=button_count&href='+url,
							style: 'width:100px;height:20px;border:none;overflow:hidden;position:absolute;top:2px;left:4em:display:none;',
							allowTransparency: 'true'
						});
		$(this)
			.css({'position':'relative','overflow':'visible'})
			.html(fframe
					.css('opacity',0)
					.stop()
					.fadeTo('slow',1)
				);

	},function(){});
}

$.fn.setHatebuCounter = function(url){
	var self = $(this),
		url = (url)? url: location.href,
		hatebu_api_url = 'http://api.b.st-hatena.com/entry.count',
		base_h = 'scriptogr.am/ia_archiver',
		alte_h = 'iaarchiver.net',
		scounter = self.find('span.scounter');

	$.when(
		$.ajax({
			type: 'GET',
			url: hatebu_api_url,
			data: { url : url },
			dataType: 'jsonp'
		}),
		$.ajax({
			type: 'GET',
			url: hatebu_api_url,
			data: { url : url.replace(base_h,alte_h) },
			dataType: 'jsonp'
		})
		).done(function(a1,a2){
			var base_c = (a1)?a1[0]:0,
				alte_c = (a2)?a2[0]:0;
			scounter
				.text(base_c+alte_c)
				.fadeTo(0,1);
		});
}

var isWin9X = (navigator.appVersion.toLowerCase().indexOf('windows 98')+1);
var isIE = (navigator.appName.toLowerCase().indexOf('internet explorer')+1?1:0);
var isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
if (isOpera) isIE = false;
var isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);
var isFirefox = (navigator.userAgent.indexOf("Firefox")+1?1:0);
var isChrome = (navigator.userAgent.indexOf("Chrome")+1?1:0);
var isiOS = (((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0)?1:0);
var isAndroid = ((navigator.userAgent.indexOf('Android') > 0)?1:0);


// 
if (!isSafari && !isFirefox && !isChrome){
    $('#eyecatch').remove();
}

// Add my frame class
/* Usage:
<div class="frame youtube" title="[title]" data-src="[embed URL like `http://www.youtube.com/embed/3cdkYdzgXLc`]">
<p>[title]</p></div>
*/

$(function(){
	$('div.frame.youtube').each(function(){
    	var dataSrc = $(this).attr('data-src');
    	//$(this).css({background:'rgba(64,64,64,0.75) url("'+ getImgFromYoutube(dataSrc) + '") center center no-repeat !important'});
        $('<div class="thumb">')
        .css({background:'rgba(64,64,64,0.75) url("'+ getImgFromYoutube(dataSrc) + '") center center no-repeat'})
            .prependTo(this);
	});
    $('div.frame').click(function() {
        var dataSrc = $(this).attr('data-src');
        if (isiOS || isAndroid) {
            window.open(dataSrc);
        } else {
            $(this).replaceWith('<iframe class="frame" src="' + dataSrc + '" frameborder="0" allowfullscreen></iframe>');
        }
    });
});

function getImgFromYoutube(url, isThumbnail) {
    isThumbnail = (/small|s|true/i).test(isThumbnail) ? true : false;
    var videoID = url.match("embed/([^&#]*)")[1];
    if (videoID != null) {
        return 'http://img.youtube.com/vi/' + videoID + '/' + (isThumbnail ? '2' : '0') + '.jpg';
    }
}

// Add GoogleAd Slider

$(function(){
    var max_screen_w = 1410, // stay Ads beyond this
        screen_w = getScreenSize().x;
        $covered = 
            $('.wrapper, .sidebar, .ex-sidebar');

    $('.slider')
        .css('width',(getScreenSize().x - max_screen_w)+'px')
        .show()
        .hover(
            function(){
                var $self = $(this),
                    $adWidth = $(this).find('iframe').attr('width')+'px';
                $(this).addClass('hover');
                var t = setTimeout(function() {
                    $self.animate({width: $adWidth},"fast");
                    //$covered.fadeTo('fast',0.6);
                    $covered.addClass('covered');
                    }, 300);
                $(this).data('timeout', t);
            }, function() {
                clearTimeout($(this).data('timeout'));
                $covered.removeClass('covered');
                //$covered.fadeTo('fast',1);

                $(this)
                    .removeClass('hover')
                    .animate({width: (getScreenSize().x-max_screen_w)});

        });

    $(window).resize(function(){
        $('.slider').hide().css('width',(getScreenSize().x-max_screen_w)+'px').fadeIn();
    });
});

function getScreenSize() {
    var obj = new Object();
    if (!isSafari && !isOpera) {
        obj.x = document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth;
    obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
    } else {
        obj.x = window.innerWidth;
        obj.y = window.innerHeight;
    }
    obj.mx = parseInt(obj.x);
    obj.my = parseInt(obj.y);
    
    return obj;
}