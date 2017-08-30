 function menu(){
	
	function menuActive(id){
		
		var menuLinks = document.getElementById(id).getElementsByTagName('a');
		var url = document.location.href;

		for (var i=0; i<menuLinks.length; i++){
			if (url == menuLinks[i].href){
				menuLinks[i].className = 'active';	
			};
		};
	};
	
menuActive('menu');
}
