function openWebGlPopup(imageName,imageId) {
	fancyboxHrefItem('myFaceShow.html?fileName=' +  imageName,"a#upimage");
	$("a#upimage").trigger('click');
	$('.image' + imageId).remove();
}
  
function fancyboxHrefItem(href,item) {
	
	$(item).fancybox({
		'padding'		: 0,
		'autoScale'		: false,
		'speedIn' 		: 200,
		'speedOut' 		: 200,
		'transitionIn'	: 'elastic',
		'transitionOut'	: 'elastic',
		'title'			: this.title,
		'width'		    : 1000,
		'height'		: 650,
		'href'			: href,
		'type'			: 'iframe'
	});

}

$(document)
.ready(
		function() {
			$("a#webcambox").fancybox({
				'padding'		: 0,
				'autoScale'		: false,
				'speedIn' 		: 200,
				'speedOut' 		: 200,
				'transitionIn'	: 'elastic',
				'transitionOut'	: 'elastic',
				'title'			: 'webcam',
				'width'		    : 500,
				'height'		: 420,
				'href'			: 'webcam.html',
				'type'			: 'iframe'
			});
		
	});