
$('document').ready(function(){
	$('#twitter').setTweetCounter();
	$('#facebook').setLikeCounter();
	$('#hatebu').setHatebuCounter();
});

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
			}).fail(function(){
				console.log('failed:TweetCounter');
			});

	compressGoogleUrl(url, function(shorturl){
		self.attr('href','https://twitter.com/share?url='+shorturl);
	})
}

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
	self.bind('click',function(){
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

	});
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
