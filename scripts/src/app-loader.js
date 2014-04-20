;(function(window){
	function Loader(element, option, callb){
		this.target = element;
		this.option = option || {};
		this.callb = callb;

		this.i = this.option.init || 0;
		this.interval = this.option.interval ||200;
		this.to;

		this.init();
	}

	Loader.prototype = {
		init: function(){
			this.target.appendChild(document.createTextNode(this.i),this.target);
			this.run();
		},
		run: function(){
			this.increment();
			var self = this;
			this.to = setTimeout(function(){self.run()}, this.interval);
		},
		stop: function(_callb){
			clearTimeout(this.to);
			if (this.callb) this.callb();
			if (_callb) _callb();
		},
		increment: function(){
			this.target.firstChild.nodeValue = this.i=this.i>=7?0:this.i+1;
		}
	};
	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function(search) {
			var d = document, elements, pattern, i, results = [];

			elements = d.getElementsByTagName("*");
			pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
			for (i = 0; i < elements.length; i++) {
				if ( pattern.test(elements[i].className) ) {
					results.push(elements[i]);
				}
			}

			return results;
		}
	}
	// document.addEventListener('DOMContentLoaded',function(){...},false)
	var loaders = document.getElementsByClassName('loader');


	for (var i=0; i<loaders.length; i++){
		var rand = [3,6,1,4,0,2,7,5];
		new Loader(loaders[i],{init:rand[i]});
	}
	var indicator = document.getElementById('indicator');
	window.indicator = new Loader(indicator,{},function(){	
		indicator.innerHTML = '&#245;'; // show done
		indicator.style.webkitAnimationPlayState = 'running'
	});


}) (window)
