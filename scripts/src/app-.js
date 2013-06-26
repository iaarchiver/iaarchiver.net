
// UserAgent Information
var isWin9X = (navigator.appVersion.toLowerCase().indexOf('windows 98')+1),
isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0),
isIE = (!isOpera && navigator.appName.toLowerCase().indexOf('internet explorer')+1?1:0),
isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0),
isFirefox = (navigator.userAgent.indexOf("Firefox")+1?1:0),
isChrome = (navigator.userAgent.indexOf("Chrome")+1?1:0),
isiOS = (((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0)?1:0),
isAndroid = ((navigator.userAgent.indexOf('Android') > 0)?1:0),
isMobile = (isiOS || isAndroid?1:0);


$(document).ready(function(){
    innerPageLinkGen($('div.innerTarget'),$('a.innerLink')); // generate innerlinks
});

$(window).resize(function() {
	// refresh() when resized
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

// Global Functions
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
}
