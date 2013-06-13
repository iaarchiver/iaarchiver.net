$(document).ready(function(){

	// Add Tag Page Title
	var p = location.pathname.split('/');
	var str = '<div class="archive-divider divider_0"><h2>Tag: <b>'+ p.pop()+'</b></h2></div>'; // Attention do .pop() here!
	if (p.pop() == 'tag'){
		$('div.post :first').prepend(str);
	}

	//  Copy Pagination Link
	/*
	var l;
	if ((l = $('div.pagination li.prev a')).size()>0){
		$('#prev').attr('href',l.attr('href'));
	}else{ $('#prev').css('visibility','hidden');}
	if ((l = $('div.pagination li.next a')).size()>0){
		$('#next').attr('href',l.attr('href'));
	}else{ $('#next').css('visibility','hidden');}
	*/

	// fadeIn & fadeOut in PageMove
	/* 
	$('#shade').animate( { opacity: 0 }, 400, function(){$('#shade').hide()});
	$('.pagination a, .post .title a').each(function(){
		var url = $(this).attr('href');
		$(this).attr('href','#');

		$(this).click(function(){
			$('#shade').show().animate( { opacity: 1 }, 400, function(){
				location.href = url;
			} );
		});
	});
	*/

	// Open New Window anchors in .body-post without footnote's
	$('.body-post a:not([rel="footnote"],[rev="footnote"])').attr('target','_blank');
	
	// Generate Scriptogr.am Sync button
	if (location.hostname == 'scriptogr.am'){
		$('#syncpanel').css('display','block');
			$('#sync').click(function(){
			  $(this).text('…');
			  $.ajax({
				  url: 'http://scriptogr.am/auth/update/',
				  context: document.body,
				  success: function(){
					window.location.reload(true);
				  }
			  });		     		
		  });
	  }


	$('#sync').click(function() {
		var target=$(this), i=0;
		(function loader(){
			target.text((i = (i >= 7) ? 0 : i + 1));
			setTimeout(loader, 150)
		})();

	    $.ajax({
	        url: 'http://scriptogr.am/auth/update/',
	        context: document.body,
	        success: function() {
	            window.location.reload(true);
	        }
	    });
	});
//<a href="http://scriptogr.am/admin/settings"><span style="position: fixed; top: 35px; right: 35px"><img src="http://scriptogr.am/lib/img/admin.png" /></span></a>
	if (location.hostname == 'scriptogr.am' && $('a>span>img[src="http://scriptogr.am/lib/img/admin.png"]').size() != 0){
    	$('#sync').css('display','block');
    }

    // Remove &nbsp textNode in .pagination of LastIndexPage
	$('.pagination ul:contains("First")')
    .contents()
    .filter(function(){
        return this.nodeType==3
                && !/\S/.test(this.data) // only whitespace
                && $.inArray($(this).parent(),$('.pagination ul'))
     }).remove();

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
                (id != 0 && id != size - 1)
                    && id != showId
                    && id != showId - 1
                    && id != showId + 1
                    && $(this).hide();
            });
        
            $target.eq(0).append('<li class="pgn pgn-prev"><a>\<</a></li>');
            $target.eq(size-1).prepend('<li class="pgn pgn-next"><a>\></a></li>');
            $target.pgnControl(showId);

            $(this).find('ul li.pgn-next').click(function() {
                if (showId+2 == size-1) return;
                $target.eq(showId+2).show();
                $target.eq(showId-1).hide();
                $target.pgnControl(++showId);
            })
            $(this).find('ul li.pgn-prev').click(function() {
                if (showId-2 == 0) return;
                $target.eq(showId-2).show();
                $target.eq(showId+1).hide();
                $target.pgnControl(--showId);
            })
        }
        $(this).show();
	})
});