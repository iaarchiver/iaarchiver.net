
// Add GoogleAd Slider

$(function(){
	var max_screen_w = 1410, // stay Ads beyond this
$covered = $('.wrapper, .sidebar, .ex-sidebar');

$('.slider')
	.css('width',($(window).width() - max_screen_w)+'px')
	.show()
	.hover(
		function(){
			var $self = $(this),
		$adWidth = $(this).find('iframe').attr('width')+'px';
	$(this).addClass('hover');
	var t = setTimeout(function() {
		$self.animate({width: $adWidth},"fast");
		$covered.addClass('covered');
	}, 300);
	$(this).data('timeout', t);
		}, function() {
			clearTimeout($(this).data('timeout'));
			$covered.removeClass('covered');

			$(this)
		.removeClass('hover')
		.animate({width: ($(window).width() - max_screen_w)});
		});

$(window).resize(function(){
	$('.slider').animate({width:($(window).width() - max_screen_w)+'px'},'ease-out');
});
});
