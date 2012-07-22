function imageSelected() {
	var imgeSrc = $(".photoslider_main").children().attr('src');
	var start = imgeSrc.indexOf("textures") + "textures".length + 1;
	imgeSrc = imgeSrc.substring(start)
	window.location = 'myFaceShow.html?imgeName=' + imgeSrc;
}

$(document).ready(
		function() {
			// change the 'baseURL' to reflect the host and or path to your
			// images
			FOTO.Slider.baseURL = 'images/';

			$.ajax({
				url : "SliderManagerServlet",
				data : "",
				dataType : "json",
				contentType : "application/json",
				success : function(data) {

					var bucket = {};
					bucket['default'] = {};
					var i = 0;

					for (imageName in data) {
						bucket['default'][i] = {
							'thumb' : data[imageName].thumName,
							'main' : '/textures/' + imageName
						};
						i++;
					}

					FOTO.Slider.bucket = bucket;
					FOTO.Slider.reload('default');
					FOTO.Slider.preloadImages('default');
					FOTO.Slider.enableSlideshow('default');
					FOTO.Slider.play('default');

					$(".photoslider_main").children().css('cursor', 'pointer');
					$(".photoslider_main").children().attr('onclick',
							'imageSelected()');
				},
				error : function(jqXHR, textStatus, errorThrown) {

				}
			});

		});

$(function() {

	var pos = 0, ctx = null, saveCB, image = [];

	var canvas = document.createElement("canvas");
	canvas.setAttribute('width', 320);
	canvas.setAttribute('height', 240);

	if (canvas.toDataURL) {

		ctx = canvas.getContext("2d");

		image = ctx.getImageData(0, 0, 320, 240);

		saveCB = function(data) {

			var col = data.split(";");
			var img = image;

			for ( var i = 0; i < 320; i++) {
				var tmp = parseInt(col[i]);
				img.data[pos + 0] = (tmp >> 16) & 0xff;
				img.data[pos + 1] = (tmp >> 8) & 0xff;
				img.data[pos + 2] = tmp & 0xff;
				img.data[pos + 3] = 0xff;
				pos += 4;
			}

			if (pos >= 4 * 320 * 240) {
				
				ctx.putImageData(img, 0, 0);
				
				var dataUrl = canvas.toDataURL();
				document.getElementById("textArea").value = img.data;
				
				$.post("UploadImage", {
					type : "data",
					image2 : canvas.toDataURL("image/png")
				});
				pos = 0;
			}
		};

	} else {

		saveCB = function(data) {
			image.push(data);

			pos += 4 * 320;

			if (pos >= 4 * 320 * 240) {
				$.post("UploadImage", {
					type : "pixel",
					image : image.join('|')
				});
				pos = 0;
			}
		};
	}

	$("#webcam").webcam({

		width : 320,
		height : 240,
		mode : "callback",
		swffile : "js/infusion-jQuery-webcam/jscam_canvas_only.swf",

		onSave : saveCB,

		onCapture : function() {
			webcam.save();
		},

		debug : function(type, string) {
			console.log(type + ": " + string);
		},
		
		onTick: function(remain) {

		    if (0 == remain) {
		        jQuery("#status").text("Cheese!");
		    } else {
		        jQuery("#status").text(remain + " seconds remaining...");
		    }
		},
		onCapture: function () {
			webcam.save();

			jQuery("#flash").css("display", "block");
			jQuery("#flash").fadeOut(100, function () {
				jQuery("#flash").css("opacity", 1);
			});
		}
		
	});
	
	
	
	function getPageSize() {

		var xScroll, yScroll;

		if (window.innerHeight && window.scrollMaxY) {
			xScroll = window.innerWidth + window.scrollMaxX;
			yScroll = window.innerHeight + window.scrollMaxY;
		} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}

		var windowWidth, windowHeight;

		if (self.innerHeight) { // all except Explorer
			if(document.documentElement.clientWidth){
				windowWidth = document.documentElement.clientWidth;
			} else {
				windowWidth = self.innerWidth;
			}
			windowHeight = self.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else if (document.body) { // other Explorers
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}

		// for small pages with total height less then height of the viewport
		if(yScroll < windowHeight){
			pageHeight = windowHeight;
		} else {
			pageHeight = yScroll;
		}

		// for small pages with total width less then width of the viewport
		if(xScroll < windowWidth){
			pageWidth = xScroll;
		} else {
			pageWidth = windowWidth;
		}

		return [pageWidth, pageHeight];
	}
	window.addEventListener("load", function() {

		jQuery("body").append("<div id=\"flash\"></div>");

		var canvas = document.getElementById("canvas");

		if (canvas.getContext) {
			ctx = document.getElementById("canvas").getContext("2d");
			ctx.clearRect(0, 0, 320, 240);

			image = ctx.getImageData(0, 0, 320, 240);
		}
		
		var pageSize = getPageSize();
		jQuery("#flash").css({ height: pageSize[1] + "px" });

	}, false);
	

	window.addEventListener("resize", function() {

		var pageSize = getPageSize();
		jQuery("#flash").css({ height: pageSize[1] + "px" });

	}, false);

});


