$(document).ready(function(){

	// Add Tag Page Title
	var p = location.pathname.split('/');
	var str = '<div class="archive-divider divider_0"><h2>Tag: <b>'+ p.pop()+'</b></h2></div>'; // Attention do .pop() here!
	if (p.pop() == 'tag'){
		$('div.post :first').prepend(str);
	}

	// Open New Window anchors in .body-post without footnote's
	$('.body-post a:not([rel="footnote"],[rev="footnote"])').attr('target','_blank');


	// Remove &nbsp textNode in .pagination of First/LastIndexPage
	$('.pagination ul:contains("First")')
	.contents()
	.filter(function(){
		return this.nodeType==3
		&& !/\S/.test(this.data) // only whitespace
		&& $.inArray($(this).parent(),$('.pagination ul'))
	}).remove();
	$('.pagination ul>a:contains("First")').wrap('<li>');

	$('.pagination ul:contains("Last")')
		.contents()
		.filter(function(){
			return this.nodeType==3
			&& !/\S/.test(this.data) // only whitespace
			&& $.inArray($(this).parent(),$('.pagination ul'))
		}).remove();
	$('.pagination ul>a:contains("Last")').wrap('<li>');

	$('.pagination').css('visibility','visible');

	// Limit .pagination-width
	$('.pagination').each(function() {
		var $target = $(this).find('ul li'),
		activeId = $target.index($(this).find('ul li.active')),
		showId = activeId,
		size = $target.size();

	$.fn.pgnControl = function(id) {
		$(this).find('.pgn').removeClass('disabled');
		if (id-2 <= 0) $(this).find('.pgn-prev').addClass('disabled');
		if (id+2 >= size-1) $(this).find('.pgn-next').addClass('disabled');
	}

	if (size >5){
		$target.each(function(id) {
			(id !== 0 && id !== size - 1)
			&& id != showId
			&& id != showId - 1
			&& id != showId + 1
			&& $(this).hide();
		});

		$target.eq(0).append('<li class="pgn pgn-prev"><a>&laquo;</a></li>');
		$target.eq(size-1).prepend('<li class="pgn pgn-next"><a>&raquo;</a></li>');
		$target.pgnControl(showId);

		$(this).find('ul li.pgn-next').click(function() {
			if (showId+2 == size-1) return;
			$target.eq(showId+2).show();
			$target.eq(showId-1).hide();
			$target.pgnControl(++showId);
		})
		$(this).find('ul li.pgn-prev').click(function() {
			if (showId-2 === 0) return;
			$target.eq(showId-2).show();
			$target.eq(showId+1).hide();
			$target.pgnControl(--showId);
		})
	}
	$(this).show();
	})
});

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

function innerPageLinkGen (targetlist,anchorlist){
	targetlist.each(function(i){
		$(this).attr('id','post'+i);
	});
	anchorlist.each(function(i){
		$(this).attr('href','#post'+i);        
	});
}
