(function($){

		$.fn.scrollable = function(options){
			var options =  $.extend({}, $.fn.scrollable.defaults, options),
				 speed = options.speed;

			// check mousewheel.js
			if (!$.event.special.mousewheel){
				console.log('error: no mousewheel.js');
				return false;
			}

			$(this).each(function(){
					!$(this).find('>.s_container').size() // init
					&& $(this)
					.unbind('mouseenter') // reset hoverevents
					.wrapInner('<div class="s_container" style="height:auto">') // wrap contents
					.find('>:first-child')
					.css({'width': $(this).width,'overflow':'hidden','position':'relative'})
					.append('<div class="scrollbar">'); // append scrollbar

					var target = $(this),
						 container = target.find('>.s_container'),
						 w = target.width(), h = target.height(), // box size
						 innerH = container.innerHeight(), // actual size
						 bar_h = h*h/innerH; // scrollbar size

					target // refresh
					.unbind('mouseenter')
					.unbind('mousewheel');

					(h >= innerH)
					&& container.css('marginTop', 0);

					(h < innerH) // make scrollable if overflow
					&& target
					.bind('mousewheel', function(event, delta) {

							var pos = parseInt(container.css('marginTop')),
								 scroll = pos + delta*speed;

							(scroll < 0 && scroll >= -innerH+h) // follow mousewheel
							&& (event.preventDefault() || container.css('marginTop',scroll))
							&& target.find('.scrollbar').css('top',-scroll*(innerH-bar_h)/(innerH-h));

							(scroll >= 0 && pos < 0) // force pos in scrolling behind
							&& (event.preventDefault() || container.css('marginTop',0))
							&& target.find('.scrollbar').css('top',0);

							(scroll < -innerH+h && pos > -innerH+h) // force pos in scrolling over
							&& (event.preventDefault() || container.css('marginTop',-innerH+h))
							&& target.find('.scrollbar').css('top',innerH-bar_h);

							(scroll < 0) // exception in resized
							&& (parseInt(container.css('marginTop')) < -innerH+h)
							&& (delta > 0)
							&& (event.preventDefault() || container.css('marginTop',scroll))
					})
					// show scrollbar when hover on
					.hover( function(){ target.find('.scrollbar').fadeIn();},
						function(){ target.find('.scrollbar').fadeOut();})
					// show scrollbar when loaded
					.find('.scrollbar').css('height',bar_h).fadeIn().delay(1000).fadeOut();

			});

			return this;
		};

		// set default options
		$.fn.scrollable.defaults = { speed: 24};

})(jQuery)
