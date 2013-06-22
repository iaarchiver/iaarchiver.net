;(function(window){
	function Loader(element, option, callb){
		this.target = element;
		this.option = option || {};
		this.callb = callb;

		this.i = this.option.init || 0;
		this.interval = this.option.interval ||200;
		this.to;

		this.init();
	};

	Loader.prototype = {
		init: function(){
			this.target.appendChild(document.createTextNode(this.i),this.target);
			this.run();
		},
		run: function(){
			this.increment();
			this.to = setTimeout(function(){this.run()}.bind(this), this.interval);
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
