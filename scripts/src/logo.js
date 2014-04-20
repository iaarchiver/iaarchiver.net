;(function(window){
	var target = document.getElementById('loader-logo');
	if (!target) return false; 
	var colorArray = ['#00B5B6','#2D358E','#C061A5','#EC5F48','#444','#B66327','#F9A236','#85C440'];

	var loader_f = document.createElement('span'),
		loader_b = document.createElement('span');

	loader_f.className = 'loader-logo-f websymbolsliga icon';
	loader_b.className = 'loader-logo-b websymbolsliga icon';

	target.appendChild(loader_f, target);
	target.appendChild(loader_b, target);

	var i=1,j=5;

	loader_f.appendChild(document.createTextNode('0'),loader_f);
	loader_b.appendChild(document.createTextNode('4'),loader_b);
	(function increment(){
		loader_f.childNodes[0].nodeValue=i=i>=7?0:i+1;
		loader_b.childNodes[0].nodeValue=j=j>=7?0:j+1;
		loader_b.style.color = colorArray[i];
		setTimeout(increment,400);
	})();

	target.addEventListener('mouseover',function(){
},false);

})(window);
