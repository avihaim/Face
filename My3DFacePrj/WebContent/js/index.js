$(document).ready(function() {
	// com test
	/* This is basic - uses default settings */

	$("a#single_image").fancybox();
	$("div#largephoto").fancybox();

	/* Using custom settings */

	$("a#uploadImage").fancybox({
		'hideOnContentClick' : false,
		'transitionIn' : 'elastic',
		'transitionOut' : 'elastic',
		'speedIn' : 200,
		'speedOut' : 200,
		'model' : true
	});
	
	//fancyboxHref('myFaceShow.html?fileName=I1.jpg');
});

function fancyboxHref(href) {
	
	$("div#largephoto").fancybox({
		'padding'		: 0,
		'autoScale'		: false,
		'speedIn' 		: 200,
		'speedOut' 		: 200,
		'transitionIn'	: 'elastic',
		'transitionOut'	: 'elastic',
		'title'			: this.title,
		'width'		    : 900,
		'height'		: 550,
		'href'			: href,
		'type'			: 'iframe'
	});
	
}


function imageSelected() {

	var imgeSrc = $("#largephoto").css('background-image');
	var patt = /\"|\'|\)/g;
	var imageName = imgeSrc.split('/').pop().replace(patt, '');
	
	window.open('myFaceShow.html?imgeName=' + imageName,'_newtab');

//	window.location = 'myFaceShow.html?imgeName=' + imageName;
}


function next() {
	
	$('#back').click(back);
	$('#back').css('cursor' ,'pointer');
	
	$('#next').unbind('click');
	$('#next').css('cursor' ,'default');
	
	var lastId = $('.last').attr('id');
	var id = parseInt(lastId.substring('thumbimage'.length, lastId.length));
	getData(id+1,'next');
	
}

function back() {
	
	$('#next').click(next);
	$('#next').css('cursor' ,'pointer');
	
	$('#back').unbind('click');
	$('#back').css('cursor' ,'default');
	
	var backId = $('.first').attr('id');
	var id = parseInt(backId.substring('thumbimage'.length, backId.length));
	getData(id--,'back');
}

function getData(from, direction) {
	
	$('.thumbnailimage').remove();
	
	$.ajax({
		url : "SliderManagerServlet?from=" + from + "&direction=" + direction,
		data : "",
		dataType : "json",
		contentType : "application/json",
		success : function(sildeData) {
			
			var data = sildeData.allFaceData;

			for ( var i = 0; i < data.length; i++) {

				var divData = '<div class="thumbnailimage" "><div class="thumb_container thumbClass'+ data[i].pos + '"> <div class="large_thumb">'
						+ '<img src="images/'
						+ data[i].thumName
						+ '" class="large_thumb_image stretch" alt="thumb" /> '
						+ '<img id="thumbimage'+ data[i].pos + '" src="images/textures/'
						+ data[i].imageName
						+ '" class="large_image" rel="" />'
						+ '<div class="large_thumb_border" ></div>'
						+ '<div class="large_thumb_shine" ></div>'
						+ '</div></div></div>';

				$('#thumbnailsId').append(divData);
				
				$('.thumbClass'+ data[i].pos).bind('click', {imageName: data[i].imageName}, function(event) {
					  fancyboxHref('myFaceShow.html?fileName=' + event.data.imageName);
				});
			}
//			onclick="thumbSelected('+ data[i].imageName + ')"
			
			
			$('#thumbimage' + data[i-1].pos).addClass("last");
			$('#thumbimage' + data[0].pos).addClass("first");
			
			/* Your ShineTime Welcome Image */
			var default_image = $('#thumbimage' + data[0].pos).attr("src");
			
			fancyboxHref('myFaceShow.html?fileName=' + data[0].imageName);
			
			var default_caption = 'Welcome to ShineTime';

			/* Load The Default Image */
			loadPhoto(default_image, default_caption);
			
			if(sildeData.haveMore) {
				
				if(direction == 'next') {
					$('#next').click(next);
					$('#next').css('cursor' ,'pointer');
				} else {
					$('#back').click(back);
					$('#back').css('cursor' ,'pointer');
					
				}
			}
			
			
			
			function loadPhoto($url, $caption) {

				/* Image pre-loader */
				showPreloader();
				var img = new Image();
				jQuery(img).load(function() {
					jQuery(img).hide();
					hidePreloader();

				}).attr({
					"src" : $url
				});

				$('#largephoto').css(
						'background-image',
						'url("' + $url + '")');

				$('#largephoto').data('caption',
						$caption);
			}

			/* When a thumbnail is clicked */
			$('.thumb_container').click(
					function() {

						var handler = $(this).find(
								'.large_image');
						var newsrc = handler
								.attr('src');
						var newcaption = handler
								.attr('rel');
						loadPhoto(newsrc, newcaption);

					});

			/* When the main photo is hovered over */
			$('#largephoto').hover(function() {

			}
			);

			/* When a thumbnail is hovered over */
			$('.thumb_container')
					.hover(
							function() {
								$(this)
										.find(
												".large_thumb")
										.stop()
										.animate(
												{
													marginLeft : -7,
													marginTop : -7
												}, 200);
								$(this)
										.find(
												".large_thumb_shine")
										.stop();
								$(this)
										.find(
												".large_thumb_shine")
										.css(
												"background-position",
												"-99px 0");
								$(this)
										.find(
												".large_thumb_shine")
										.animate(
												{
													backgroundPosition : '99px 0'
												}, 700);

							},
							function() {
								$(this)
										.find(
												".large_thumb")
										.stop()
										.animate(
												{
													marginLeft : 0,
													marginTop : 0
												}, 200);
							});

			function showPreloader() {
				$('#loader')
						.css('background-image',
								'url("images/interface/loader.gif")');
			}

			function hidePreloader() {
				$('#loader').css('background-image',
						'url("")');
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {

		}
	});
	
}


$(document)
		.ready(
				function() {
					getData(0,'next');
					 
					$('#largephoto').bind('click', function(e){
				        if(e.which == 2){
				        	alert("2");
				        	imageSelected();
				        }
				    });


				});