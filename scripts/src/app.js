var isWin9X = (navigator.appVersion.toLowerCase().indexOf('windows 98')+1);
var isIE = (navigator.appName.toLowerCase().indexOf('internet explorer')+1?1:0);
var isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
if (isOpera) isIE = false;
var isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);
var isFirefox = (navigator.userAgent.indexOf("Firefox")+1?1:0);
var isChrome = (navigator.userAgent.indexOf("Chrome")+1?1:0);
var isiOS = (((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0)?1:0);
var isAndroid = ((navigator.userAgent.indexOf('Android') > 0)?1:0);
 
$(document).ready(function(){
	innerPageLinkGen($('div.innerTarget'),$('a.innerLink')); // generate innerlinks
});

$(window).resize(function() {
	if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
		refresh();
	}, 500);
});

$(window).keydown(function(e){
	if (e.which == 37){
		var anchor = $('#up').attr('href');
		$('body,html').scrollTop($(anchor).position().top+5);
		location.hash = anchor;
	}else if (e.which == 39){
		var anchor = $('#down').attr('href');
		$('body,html').scrollTop($(anchor).position().top+5);
		location.hash = anchor;
	}
});

function refresh(){
	$('[data-spy="scroll"]').scrollspy('refresh');
	$('.ex-sidebar').scrollable();
}

function compressGoogleUrl(url ,callb){
	$.ajax({
		url : "http://glurl-tool.appspot.com",
		dataType : "jsonp",
		data : { url : url },
		success : function( data ){
			callb(data.error  ? false : data.id);
		}
	});
};
